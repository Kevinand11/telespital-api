import { IAnswerRepository } from '../../domain/irepositories/answers'
import { AnswerMapper } from '../mappers/answers'
import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { Answer } from '../mongooseModels/answers'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser } from '../../domain/types'

export class AnswerRepository implements IAnswerRepository {
	private static instance: AnswerRepository
	private mapper: AnswerMapper

	private constructor () {
		this.mapper = new AnswerMapper()
	}

	static getInstance () {
		if (!AnswerRepository.instance) AnswerRepository.instance = new AnswerRepository()
		return AnswerRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<AnswerFromModel>(Answer, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: AnswerToModel) {
		const answer = await new Answer(data).save()
		return this.mapper.mapFrom(answer)!
	}

	async find (id: string) {
		const answer = await Answer.findById(id)
		return this.mapper.mapFrom(answer)
	}

	async update (id: string, userId: string, data: Partial<AnswerToModel>) {
		const answer = await Answer.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(answer)
	}

	async delete (id: string, userId: string) {
		const answer = await Answer.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!answer
	}

	async updateUserBio (user: EmbeddedUser) {
		const answers = await Answer.updateMany({ 'user.id': user.id }, { $set: { user } })
		return !!answers.acknowledged
	}

	async deleteQuestionAnswers (questionId: string) {
		const answers = await Answer.deleteMany({ questionId })
		return !!answers.acknowledged
	}
}
