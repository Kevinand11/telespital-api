import { Currencies, EmbeddedUser, Prescription, SessionCancelled, SessionStatus } from '../../domain/types'

export interface SessionFromModel extends SessionToModel {
	_id: string
	cancelled: SessionCancelled | null
	ratings: Record<string, string>
	startedAt: number | null
	closedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface SessionToModel {
	doctor: EmbeddedUser | null
	patient: EmbeddedUser
	status: SessionStatus
	description: string
	note: string
	prescriptions: Prescription[]
	price: number
	currency: Currencies
	paid: boolean
}