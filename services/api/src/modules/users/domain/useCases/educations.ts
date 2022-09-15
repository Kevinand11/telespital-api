import { IEducationRepository } from '../irepositories/educations'
import { EducationToModel } from '../../data/models/educations'
import { QueryParams } from '@stranerd/api-commons'

export class EducationsUseCase {
	private repository: IEducationRepository

	constructor (repository: IEducationRepository) {
		this.repository = repository
	}

	async add (data: EducationToModel) {
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

	async update (input: { id: string, userId: string, data: Partial<EducationToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}
}
