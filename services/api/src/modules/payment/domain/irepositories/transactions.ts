import { TransactionToModel } from '../../data/models/transactions'
import { TransactionEntity } from '../entities/transactions'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface ITransactionRepository {
	create: (data: TransactionToModel) => Promise<TransactionEntity>
	get: (query: QueryParams) => Promise<QueryResults<TransactionEntity>>
	find: (id: string, userId: string) => Promise<TransactionEntity | null>
	update: (id: string, data: Partial<TransactionToModel>) => Promise<TransactionEntity | null>
	delete: (ids: string[]) => Promise<boolean>
}
