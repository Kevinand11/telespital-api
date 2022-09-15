import { QueryParams } from '@stranerd/api-commons'
import { ITransactionRepository } from '../irepositories/transactions'
import { TransactionToModel } from '../../data/models/transactions'

export class TransactionsUseCase {
	repository: ITransactionRepository

	constructor (repo: ITransactionRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (data: { id: string, userId: string }) {
		return await this.repository.find(data.id, data.userId)
	}

	async create (data: TransactionToModel) {
		return await this.repository.create(data)
	}

	async update (data: { id: string, data: Partial<TransactionToModel> }) {
		return await this.repository.update(data.id, data.data)
	}

	async delete (ids: string[]) {
		return await this.repository.delete(ids)
	}
}