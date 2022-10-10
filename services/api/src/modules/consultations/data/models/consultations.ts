import { ConsultationCancelled, ConsultationStatus, Currencies, EmbeddedUser, Prescription } from '../../domain/types'

export interface ConsultationFromModel extends ConsultationToModel {
	_id: string
	cancelled: ConsultationCancelled | null
	startedAt: number | null
	closedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface ConsultationToModel {
	doctor: EmbeddedUser | null
	patient: EmbeddedUser
	status: ConsultationStatus
	description: string
	note: string
	prescriptions: Prescription[]
	price: number
	currency: Currencies
	paid: boolean
}