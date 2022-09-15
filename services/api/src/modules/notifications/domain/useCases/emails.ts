import { IErrorRepository } from '../irepositories/errors'
import { ErrorToModel } from '../../data/models/errors'

export class EmailsUseCase {
	private repository: IErrorRepository

	constructor (repository: IErrorRepository) {
		this.repository = repository
	}

	async addError (data: ErrorToModel) {
		return await this.repository.add(data)
	}

	async getAndDeleteAllErrors () {
		return await this.repository.getAndDeleteAll()
	}
}
