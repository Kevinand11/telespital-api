import { MessageMapper } from '../mappers/messages'
import { IMessageRepository } from '../../domain/irepositories/messages'
import { MessageFromModel, MessageToModel } from '../models/messages'
import { Message } from '../mongooseModels/messages'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'

export class MessageRepository implements IMessageRepository {
	private static instance: MessageRepository
	private mapper: MessageMapper

	private constructor () {
		this.mapper = new MessageMapper()
	}

	static getInstance () {
		if (!MessageRepository.instance) MessageRepository.instance = new MessageRepository()
		return MessageRepository.instance
	}

	async add (data: MessageToModel) {
		const createdAt = Date.now()
		const message = await new Message({
			...data, createdAt, updatedAt: createdAt,
			readAt: { [data.from]: createdAt }
		}).save()
		return this.mapper.mapFrom(message)!
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<MessageFromModel>(Message, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find (id: string) {
		const message = await Message.findById(id)
		return this.mapper.mapFrom(message)
	}

	async update (id: string, userId: string, data: Partial<MessageToModel>) {
		const message = await Message.findOneAndUpdate({
			_id: id, from: userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(message)
	}

	async markRead (from: string, sessionId: string) {
		const res = await Message.updateMany(
			{ sessionId, [`readAt.${from}`]: null },
			{ $set: { [`readAt.${from}`]: Date.now() } })
		return res.acknowledged
	}

	async delete (id: string, userId: string) {
		const message = await Message.findOneAndDelete({ _id: id, 'from.id': userId })
		return !!message
	}

	async deleteSessionMessages (sessionId: string) {
		const messages = await Message.deleteMany({ sessionId })
		return messages.acknowledged
	}
}
