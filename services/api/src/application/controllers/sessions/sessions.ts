import { AuthUserType } from '@modules/auth'
import { Currencies, MethodsUseCases, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { PrescriptionUnit, SessionStatus, SessionsUseCases } from '@modules/sessions'
import { UsersUseCases } from '@modules/users'
import { checkPermissions } from '@utils/modules/auth'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { LiveVideo } from '@utils/modules/sessions/video'
import { AuthRole, BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class SessionsController {
	static async getSessions (req: Request) {
		const query = req.query as QueryParams
		const hasAccess = req.authUser!.type === AuthUserType.doctor || checkPermissions(req.authUser, [AuthRole.canViewSessions])
		if (!hasAccess) query.auth = [{ field: 'patient.id', value: req.authUser!.id }]
		return await SessionsUseCases.get(query)
	}

	static async findSession (req: Request) {
		const session = await SessionsUseCases.find(req.params.id)
		const hasAccess = req.authUser!.type === AuthUserType.doctor || checkPermissions(req.authUser, [AuthRole.canViewSessions])
		if (hasAccess) return session
		if (!session || !session.getParticipants().includes(req.authUser!.id)) return null
		return session
	}

	static async connect (req: Request) {
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')
		return await SessionsUseCases.connect(user.getEmbedded())
	}

	static async createSession (req: Request) {
		const data = validate({
			description: Schema.string().min(1)
		}, req.body)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await SessionsUseCases.add({
			patient: user.getEmbedded(), doctor: null,
			description: data.description, status: SessionStatus.pendingPay,
			prescriptions: [], note: '',
			price: 50, currency: Currencies.USD, paid: false
		})
	}

	static async updateDescription (req: Request) {
		const data = validate({
			description: Schema.string().min(1)
		}, req.body)

		return await SessionsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: false
		})
	}

	static async updatePrescriptions (req: Request) {
		const data = validate({
			prescriptions: Schema.array(Schema.object({
				medication: Schema.string().min(1),
				dosage: Schema.string().min(1),
				unit: Schema.any<PrescriptionUnit>().in(Object.values(PrescriptionUnit))
			}))
		}, req.body)

		return await SessionsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: true
		})
	}

	static async updateNote (req: Request) {
		const data = validate({
			note: Schema.string().min(1)
		}, req.body)

		return await SessionsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: true
		})
	}

	static async payForSession (req: Request) {
		const data = validate({
			methodId: Schema.string().min(1)
		}, req.body)

		const userId = req.authUser!.id
		const session = await SessionsUseCases.find(req.params.id)
		if (!session || session.patient.id !== userId) throw new NotAuthorizedError()
		if (session.paid) return true
		const method = await MethodsUseCases.find(data.methodId)
		if (!method || method.userId !== userId) throw new BadRequestError('invalid method')
		const email = session.patient.bio.email

		const successful = await BraintreePayment.charge({
			token: method.token, currency: session.currency, amount: session.price
		})

		await TransactionsUseCases.create({
			email, userId, status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed,
			title: 'Paid for session', amount: 0 - session.price, currency: session.currency,
			data: {
				type: TransactionType.PayForSession,
				sessionId: session.id
			}
		})

		return successful
	}

	static async closeSession (req: Request) {
		const ended = await SessionsUseCases.close({ id: req.params.id, doctorId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}

	static async cancelSession (req: Request) {
		const { reason } = validate({
			reason: Schema.string().min(1)
		}, req.body)

		const cancelled = await SessionsUseCases.cancel({ id: req.params.id, reason, userId: req.authUser!.id })
		if (cancelled) return cancelled
		throw new NotAuthorizedError()
	}

	static async rateSession (req: Request) {
		const data = validate({
			rating: Schema.number().round(0).gte(0).lte(5),
			message: Schema.string()
		}, req.body)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await SessionsUseCases.rate({
			...data, sessionId: req.params.id, user: user.getEmbedded()
		})
	}

	static async joinSession (req: Request) {
		const userId = req.authUser!.id
		const session = await SessionsUseCases.find(req.params.id)
		if (!session || !session.getParticipants().includes(userId)) throw new NotAuthorizedError()
		if (session.closedAt) throw new BadRequestError('session has been closed')
		const user = [session.doctor!, session.patient].find((u) => u?.id === userId)!
		return await LiveVideo.getRoomToken({
			sessionId: session.id,
			userId: user.id,
			userName: user.bio.name.first,
			isDoctor: session.doctor?.id === userId
		})
	}

	static async getSessionDetails (req: Request) {
		const sessionId = req.params.id
		return await LiveVideo.getSessions(sessionId)
	}
}