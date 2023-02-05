import { PayoutPay, PayoutStatus, PayoutSettlement } from '../../domain/types'

export interface PayoutFromModel extends PayoutToModel {
	_id: string
	pay: PayoutPay
	status: PayoutStatus
	settlement: PayoutSettlement
	createdAt: number
	updatedAt: number
}

export interface PayoutToModel {
	userId: string
}