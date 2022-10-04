import { ITransactionRepository } from '../../domain/irepositories/transactions'
import { TransactionMapper } from '../mappers/transactions'
import { TransactionFromModel, TransactionToModel } from '../models/transactions'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { Transaction } from '../mongooseModels/transactions'

export class TransactionRepository implements ITransactionRepository {
	private static instance: TransactionRepository
	private mapper: TransactionMapper

	private constructor () {
		this.mapper = new TransactionMapper()
	}

	static getInstance () {
		if (!TransactionRepository.instance) TransactionRepository.instance = new TransactionRepository()
		return TransactionRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<TransactionFromModel>(Transaction, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async create (data: TransactionToModel) {
		const transaction = await new Transaction(data).save()
		return this.mapper.mapFrom(transaction)!
	}

	async find (id: string) {
		const transaction = await Transaction.findById(id )
		return this.mapper.mapFrom(transaction)
	}

	async update (id: string, data: Partial<TransactionToModel>) {
		const transaction = await Transaction.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(transaction)
	}

	async delete (ids: string[]) {
		const transactions = await Transaction.deleteMany({ _id: { $in: ids } })
		return transactions.acknowledged
	}
}
