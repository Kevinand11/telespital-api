import { ConsultationCancelled, ConsultationStatus, Currencies, EmbeddedUser, Prescription } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class ConsultationEntity extends BaseEntity {
	public readonly id: string
	public readonly doctor: EmbeddedUser | null
	public readonly patient: EmbeddedUser
	public readonly description: string
	public readonly status: ConsultationStatus
	public readonly note: string
	public readonly prescriptions: Prescription[]
	public readonly price: number
	public readonly currency: Currencies
	public readonly paid: boolean
	public readonly ratings: Record<string, string>
	public readonly cancelled: ConsultationCancelled | null
	public readonly startedAt: number | null
	public readonly closedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, doctor, patient, prescriptions, note,
		             description, price, currency, paid, status, ratings,
		             cancelled, startedAt, closedAt, createdAt, updatedAt
	             }: ConsultationConstructorArgs) {
		super()
		this.id = id
		this.doctor = doctor
		this.patient = patient
		this.prescriptions = prescriptions
		this.note = note
		this.description = description
		this.price = price
		this.currency = currency
		this.paid = paid
		this.status = status
		this.ratings = ratings
		this.cancelled = cancelled
		this.startedAt = startedAt
		this.closedAt = closedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getParticipants () {
		const participants = [this.patient.id]
		if (this.doctor) participants.push(this.doctor.id)
		return participants
	}
}

type ConsultationConstructorArgs = {
	id: string
	doctor: EmbeddedUser | null
	patient: EmbeddedUser
	description: string
	status: ConsultationStatus
	prescriptions: Prescription[]
	note: string
	price: number
	currency: Currencies
	paid: boolean
	ratings: Record<string, string>
	cancelled: ConsultationCancelled | null
	startedAt: number | null
	closedAt: number | null
	createdAt: number
	updatedAt: number
}