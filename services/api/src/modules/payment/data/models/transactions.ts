import { Currencies, TransactionData, TransactionStatus } from '../../domain/types'

export interface TransactionFromModel extends TransactionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface TransactionToModel {
	userId: string
	email: string
	title: string
	amount: number
	currency: Currencies
	status: TransactionStatus
	data: TransactionData
}