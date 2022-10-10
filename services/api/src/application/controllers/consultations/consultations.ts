import { ConsultationStatus, ConsultationsUseCases, PrescriptionUnit } from '@modules/consultations'
import { UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	QueryKeys,
	QueryParams,
	Request,
	validate,
	Validation
} from '@stranerd/api-commons'
import { CardsUseCases, Currencies, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { StripePayment } from '@utils/modules/payment/stripe'

export class ConsultationsController {
	static async getConsultations (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'doctor.id', value: req.authUser!.id }, { field: 'patient.id', value: req.authUser!.id }]
		query.authType = QueryKeys.or
		return await ConsultationsUseCases.get(query)
	}

	static async findConsultation (req: Request) {
		const consultation = await ConsultationsUseCases.find(req.params.id)
		if (!consultation || !consultation.getParticipants().includes(req.authUser!.id)) return null
		return consultation
	}

	static async connect (req: Request) {
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')
		return await ConsultationsUseCases.connect(user.getEmbedded())
	}

	static async createConsultation (req: Request) {
		const data = validate({
			description: req.body.description
		}, {
			description: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await ConsultationsUseCases.add({
			patient: user.getEmbedded(), doctor: null,
			description: data.description, status: ConsultationStatus.pendingPay,
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

		return await ConsultationsUseCases.update({
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

		return await ConsultationsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: true
		})
	}

	static async updateNote (req: Request) {
		const data = validate({
			note: req.body.description
		}, {
			note: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		return await ConsultationsUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data, byDoctor: true
		})
	}

	static async payForConsultation (req: Request) {
		const data = validate({
			cardId: req.body.cardId
		}, {
			cardId: { required: true, rules: [Validation.isString] }
		})

		const userId = req.authUser!.id
		const consultation = await ConsultationsUseCases.find(req.params.id)
		if (!consultation || consultation.patient.id !== userId) throw new NotAuthorizedError()
		if (consultation.paid) return true
		const card = await CardsUseCases.find(data.cardId)
		if (!card || card.userId !== userId) throw new BadRequestError('invalid card')
		const email = consultation.patient.bio.email

		const successful = await StripePayment.chargeCard({
			userId: card.userId, email, token: card.token,
			currency: consultation.currency, amount: consultation.price
		})

		await TransactionsUseCases.create({
			email, userId, status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed,
			title: 'Paid for consultation', amount: consultation.price, currency: consultation.currency,
			data: {
				type: TransactionType.PayForConsultation,
				consultationId: consultation.id
			}
		})

		return successful
	}

	static async closeConsultation (req: Request) {
		const ended = await ConsultationsUseCases.close({ id: req.params.id, doctorId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}

	static async cancelConsultation (req: Request) {
		const { reason } = validate({
			reason: req.body.reason
		}, {
			reason: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		const cancelled = await ConsultationsUseCases.cancel({ id: req.params.id, reason, userId: req.authUser!.id })
		if (cancelled) return cancelled
		throw new NotAuthorizedError()
	}
}