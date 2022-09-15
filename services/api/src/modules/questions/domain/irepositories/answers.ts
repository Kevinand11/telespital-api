import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { AnswerToModel } from '../../data/models/answers'
import { AnswerEntity } from '../entities/answers'
import { EmbeddedUser } from '../types'

export interface IAnswerRepository {
	add: (data: AnswerToModel) => Promise<AnswerEntity>
	get: (query: QueryParams) => Promise<QueryResults<AnswerEntity>>
	find: (id: string) => Promise<AnswerEntity | null>
	update: (id: string, userId: string, data: Partial<AnswerToModel>) => Promise<AnswerEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	deleteQuestionAnswers: (questionId: string) => Promise<boolean>
}
