import { PayoutPay, PayoutStatus } from '../../domain/types'

export interface PayoutFromModel extends PayoutToModel {
	_id: string
	pay: PayoutPay
	status: PayoutStatus
	createdAt: number
	updatedAt: number
}

export interface PayoutToModel {
	userId: string
}