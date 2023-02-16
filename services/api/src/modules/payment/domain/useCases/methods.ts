import { QueryParams } from 'equipped'
import { IMethodRepository } from '../irepositories/methods'
import { MethodToModel } from '../../data/models/methods'

export class MethodsUseCase {
	repository: IMethodRepository

	constructor (repo: IMethodRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async create (data: MethodToModel) {
		return await this.repository.create(data)
	}

	async makePrimary (data: { id: string, userId: string }) {
		return await this.repository.makePrimary(data.id, data.userId)
	}

	async markExpireds () {
		return await this.repository.markExpireds()
	}

	async delete (data: { id: string, userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}
}