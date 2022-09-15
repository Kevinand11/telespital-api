import { IAnswerRepository } from '../irepositories/answers'
import { AnswerToModel } from '../../data/models/answers'
import { QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser } from '../types'

export class AnswersUseCase {
	private repository: IAnswerRepository

	constructor (repository: IAnswerRepository) {
		this.repository = repository
	}

	async add (data: AnswerToModel) {
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

	async update (input: { id: string, userId: string, data: Partial<AnswerToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async deleteQuestionAnswers (questionId: string) {
		return await this.repository.deleteQuestionAnswers(questionId)
	}
}

