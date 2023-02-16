import { EmbeddedUser } from '@modules/users'
export { Currencies } from '@modules/payment'
export { MediaOutput as Media } from 'equipped'

export { EmbeddedUser }

export enum SessionStatus {
	pendingPay = 'pendingPay',
	waiting = 'waiting',
	ongoing = 'ongoing',
	pendingRating = 'pendingRating',
	cancelled = 'cancelled',
	completed = 'completed'
}

export enum PrescriptionUnit {
	tablet = 'tablet',
	syrup = 'syrup'
}

export type Prescription = {
	medication: string
	unit: PrescriptionUnit
	dosage: string
}

export type SessionCancelled = {
	userId: string
	at: number
	reason: string
}

export type ReportSettlement = {
	userId: string
	at: number
} | null

export enum ReportStatus {
	created = 'created',
	settled = 'settled',
}

export type ReportData = {
	sessionId: string
	doctor: EmbeddedUser
	patient: EmbeddedUser
}