export { EmbeddedUser } from '@modules/users'
export { Currencies } from '@modules/payment'

export enum ConsultationStatus {
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

export type ConsultationCancelled = {
	userId: string
	at: number
	reason: string
}