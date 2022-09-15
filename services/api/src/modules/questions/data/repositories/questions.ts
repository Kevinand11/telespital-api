import { IQuestionRepository } from '../../domain/irepositories/questions'
import { QuestionMapper } from '../mappers/questions'
import { QuestionFromModel, QuestionToModel } from '../models/questions'
import { Question } from '../mongooseModels/questions'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser, MAX_ANSWERS_COUNT } from '../../domain/types'

export class QuestionRepository implements IQuestionRepository {
	private static instance: QuestionRepository
	private mapper: QuestionMapper

	private constructor () {
		this.mapper = new QuestionMapper()
	}

	static getInstance () {
		if (!QuestionRepository.instance) QuestionRepository.instance = new QuestionRepository()
		return QuestionRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<QuestionFromModel>(Question, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: QuestionToModel) {
		const question = await new Question(data).save()
		return this.mapper.mapFrom(question)!
	}

	async find (id: string) {
		const question = await Question.findById(id)
		return this.mapper.mapFrom(question)
	}

	async update (id: string, userId: string, data: Partial<QuestionToModel>) {
		const question = await Question.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data })
		return this.mapper.mapFrom(question)
	}

	async updateAnswers (id: string, answerId: string, userId: string, add: boolean) {
		const question = await Question.findByIdAndUpdate(id, {
			[add ? '$addToSet' : '$pull']: { answers: { id: answerId, userId } }
		}, { new: true })
		return !!question
	}

	async updateUserBio (user: EmbeddedUser) {
		const questions = await Question.updateMany({ 'user.id': user.id }, { $set: { user } })
		return questions.acknowledged
	}

	async delete (id: string, userId: string) {
		const question = await Question.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!question
	}

	async deleteSubjectQuestions (subjectId: string) {
		const questions = await Question.deleteMany({ subjectId })
		return questions.acknowledged
	}

	async hold (id: string, userId: string, hold: boolean) {
		const find = hold ?
			{ _id: id, heldBy: null, [`answers.${MAX_ANSWERS_COUNT - 1}`]: { $exists: false } } :
			{ _id: id, 'heldBy.userId': userId }
		const now = Date.now()
		const release = now + (60 * 60 * 1000)
		const set = hold ?
			{ $set: { heldBy: { userId, heldAt: now, releasedAt: release } } } :
			{ $set: { heldBy: null } }
		const question = await Question.findOneAndUpdate(find, set, { new: true })
		return this.mapper.mapFrom(question)
	}
}
