import { ReviewEntity } from '../entities/reviews'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { EmbeddedUser } from '../types'
import { ReviewToModel } from '../../data/models/reviews'

export interface IReviewRepository {
	get: (condition: QueryParams) => Promise<QueryResults<ReviewEntity>>
	find: (id: string) => Promise<ReviewEntity | null>
	update: (id: string, userId: string, data: Partial<ReviewToModel>) => Promise<ReviewEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}