import { SessionEntity } from '../entities/sessions'
import { SessionToModel } from '../../data/models/sessions'
import { QueryParams, QueryResults } from 'equipped'
import { EmbeddedUser } from '../types'
import { ReviewToModel } from '../../data/models/reviews'
import { ReviewEntity } from '../entities/reviews'

export interface ISessionRepository {
	add: (data: SessionToModel) => Promise<SessionEntity>
	get: (condition: QueryParams) => Promise<QueryResults<SessionEntity>>
	find: (id: string) => Promise<SessionEntity | null>
	connect: (user: EmbeddedUser) => Promise<SessionEntity | null>
	update: (id: string, userId: string, data: Partial<SessionToModel>, byDoctor: boolean) => Promise<SessionEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	updatePaid: (id: string, add: boolean) => Promise<boolean>
	close: (id: string, userId: string) => Promise<boolean>
	cancel: (id: string, userId: string, reason: string) => Promise<boolean>
	rate: (data: Omit<ReviewToModel, 'to'>) => Promise<ReviewEntity>
}