import { PrescriptionUnit, SessionStatus, SessionsUseCases } from '@modules/sessions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { Currencies, MethodsUseCases, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { LiveVideo } from '@utils/modules/sessions/video'
import { AuthUserType } from '@modules/auth'

export class SessionsController {
	static async getSessions (req: Request) {
		const query = req.query as QueryParams
		if (req.authUser!.type !== AuthUserType.doctor) {
			query.auth = [{ field: 'patient.id', value: req.authUser!.id }]
		}
		return await SessionsUseCases.get(query)
	}

	static async findSession (req: Request) {
		const session = await SessionsUseCases.find(req.params.id)
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
			description: req.body.description
		}, {
			description: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

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
			description: req.body.description
		}, {
			description: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		return await SessionsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: false
		})
	}

	static async updatePrescriptions (req: Request) {
		const data = validate({
			prescriptions: req.body.prescriptions
		}, {
			prescriptions: {
				required: true, rules: [Validation.isArrayOfX((val: any) => {
					const valid = [
						Validation.isString(val.medication).valid, Validation.isString(val.dosage).valid,
						Validation.arrayContains(val.unit, Object.keys(PrescriptionUnit), (cur, val) => cur === val)
					]
					return valid.every((v) => v)
				}, 'prescriptions')]
			}
		})

		return await SessionsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: true
		})
	}

	static async updateNote (req: Request) {
		const data = validate({
			note: req.body.note
		}, {
			note: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		return await SessionsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: true
		})
	}

	static async payForSession (req: Request) {
		const data = validate({
			methodId: req.body.methodId
		}, {
			methodId: { required: true, rules: [Validation.isString] }
		})

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
			reason: req.body.reason
		}, {
			reason: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		const cancelled = await SessionsUseCases.cancel({ id: req.params.id, reason, userId: req.authUser!.id })
		if (cancelled) return cancelled
		throw new NotAuthorizedError()
	}

	static async rateSession (req: Request) {
		const data = validate({
			rating: parseInt(req.body.rating),
			message: req.body.message
		}, {
			rating: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(0), Validation.isLessThanOrEqualToX(5)]
			},
			message: { required: true, rules: [Validation.isString] }
		})

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