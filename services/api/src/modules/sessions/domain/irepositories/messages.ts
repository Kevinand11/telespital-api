import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { MessageToModel } from '../../data/models/messages'
import { MessageEntity } from '../entities/messages'

export interface IMessageRepository {
	add: (data: MessageToModel) => Promise<MessageEntity>,
	get: (query: QueryParams) => Promise<QueryResults<MessageEntity>>
	find: (id: string) => Promise<MessageEntity | null>
	update: (id: string, userId: string, data: Partial<MessageToModel>) => Promise<MessageEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	markRead: (from: string, sessionId: string) => Promise<boolean>
	deleteSessionMessages: (sessionId: string) => Promise<boolean>
}
