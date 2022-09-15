import { ISubjectRepository } from '../irepositories/subjects'
import { SubjectToModel } from '../../data/models/subjects'
import { QueryParams } from '@stranerd/api-commons'

export class SubjectsUseCase {
	private repository: ISubjectRepository

	constructor (repository: ISubjectRepository) {
		this.repository = repository
	}

	async add (data: SubjectToModel) {
		return await this.repository.add(data)
	}

	async delete (input: { id: string }) {
		return await this.repository.delete(input.id)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, data: Partial<SubjectToModel> }) {
		return await this.repository.update(input.id, input.data)
	}
}

