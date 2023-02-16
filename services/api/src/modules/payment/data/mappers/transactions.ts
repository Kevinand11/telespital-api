import { BaseMapper } from 'equipped'
import { TransactionEntity } from '../../domain/entities/transactions'
import { TransactionFromModel, TransactionToModel } from '../models/transactions'

export class TransactionMapper extends BaseMapper<TransactionFromModel, TransactionToModel, TransactionEntity> {
	mapFrom (param: TransactionFromModel | null) {
		return !param ? null : new TransactionEntity({
			id: param._id.toString(),
			userId: param.userId,
			email: param.email,
			title: param.title,
			amount: param.amount,
			currency: param.currency,
			status: param.status,
			data: param.data,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: TransactionEntity) {
		return {
			userId: param.userId,
			email: param.email,
			title: param.title,
			amount: param.amount,
			currency: param.currency,
			status: param.status,
			data: param.data
		}
	}
}