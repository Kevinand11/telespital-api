import { IQuestionRepository } from '../irepositories/questions'
import { QuestionToModel } from '../../data/models/questions'
import { QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser } from '../types'

export class QuestionsUseCase {
	private repository: IQuestionRepository

	constructor (repository: IQuestionRepository) {
		this.repository = repository
	}

	async add (data: QuestionToModel) {
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

	async update (input: { id: string, userId: string, data: Partial<QuestionToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async updateAnswers (input: { questionId: string, answerId: string, userId: string, add: boolean }) {
		return await this.repository.updateAnswers(input.questionId, input.answerId, input.userId, input.add)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async deleteSubjectQuestions (subjectId: string) {
		return await this.repository.deleteSubjectQuestions(subjectId)
	}

	async hold (data: { id: string, userId: string, hold: boolean }) {
		return await this.repository.hold(data.id, data.userId, data.hold)
	}
}
