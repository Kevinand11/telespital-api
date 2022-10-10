import { IConsultationRepository } from '../../domain/irepositories/consultations'
import { ConsultationMapper } from '../mappers/consultations'
import { ConsultationFromModel, ConsultationToModel } from '../models/consultations'
import { Consultation } from '../mongooseModels/consultations'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { ConsultationStatus, EmbeddedUser } from '../../domain/types'

export class ConsultationRepository implements IConsultationRepository {
	private static instance: ConsultationRepository
	private mapper: ConsultationMapper

	private constructor () {
		this.mapper = new ConsultationMapper()
	}

	static getInstance () {
		if (!ConsultationRepository.instance) ConsultationRepository.instance = new ConsultationRepository()
		return ConsultationRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<ConsultationFromModel>(Consultation, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: ConsultationToModel) {
		const consultation = await Consultation.findOneAndUpdate({
			status: { $in: [ConsultationStatus.pendingPay, ConsultationStatus.waiting] },
			'patient.id': data.patient.id
		}, { $setOnInsert: data }, { new: true, upsert: true })
		return this.mapper.mapFrom(consultation)!
	}

	async find (id: string) {
		const consultation = await Consultation.findById(id)
		return this.mapper.mapFrom(consultation)
	}

	async connect (user: EmbeddedUser) {
		const consultation = await Consultation.findOneAndUpdate(
			{ status: ConsultationStatus.waiting, 'patient.id': { $ne: user.id } },
			{ $set: { doctor: user, status: ConsultationStatus.ongoing } }
		)
		return this.mapper.mapFrom(consultation)
	}

	async update (id: string, userId: string, data: Partial<ConsultationToModel>, byDoctor: boolean) {
		const consultation = await Consultation.findOneAndUpdate(
			{ _id: id, [byDoctor ? 'doctor.id' : 'patient.id']: userId },
			{ $set: data }
		)
		return this.mapper.mapFrom(consultation)
	}

	async updateUserBio (user: EmbeddedUser) {
		const result = await Promise.all([
			Consultation.updateMany({ 'patient.id': user.id }, { $set: { patient: user } }),
			Consultation.updateMany({ 'doctor.id': user.id }, { $set: { doctor: user } })
		])
		return result.every((r) => r.acknowledged)
	}

	async updatePaid (id: string, add: boolean) {
		const consultation = await Consultation.findByIdAndUpdate(id, {
			$set: { paid: add, ...(add ? { status: ConsultationStatus.waiting } : {}) }
		})
		return !!consultation
	}

	async close (id: string, userId: string) {
		const consultation = await Consultation.findOneAndUpdate(
			{ _id: id, closedAt: null, cancelled: null, 'doctor.id': userId, startedAt: { $ne: null } },
			{ $set: { closedAt: Date.now(), status: ConsultationStatus.pendingRating } })
		return !!consultation
	}

	async cancel (id: string, userId: string, reason: string) {
		const consultation = await Consultation.findOneAndUpdate(
			{ _id: id, closedAt: null, cancelled: null, 'patient.id': userId, startedAt: null },
			{
				$set: {
					cancelled: { userId, reason, at: Date.now() },
					closedAt: Date.now(),
					status: ConsultationStatus.completed
				}
			})
		return !!consultation
	}
}
