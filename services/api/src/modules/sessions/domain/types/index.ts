export { EmbeddedUser } from '@modules/users'
export { Currencies } from '@modules/payment'
export { MediaOutput as Media } from '@stranerd/api-commons'

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