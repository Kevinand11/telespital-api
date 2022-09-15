import { IWorkRepository } from '../irepositories/works'
import { WorkToModel } from '../../data/models/works'
import { QueryParams } from '@stranerd/api-commons'

export class WorksUseCase {
	private repository: IWorkRepository

	constructor (repository: IWorkRepository) {
		this.repository = repository
	}

	async add (data: WorkToModel) {
		return await this.repository.add(data)
	}

	async delete (input: { id: string, userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, userId: string, data: Partial<WorkToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}
}
