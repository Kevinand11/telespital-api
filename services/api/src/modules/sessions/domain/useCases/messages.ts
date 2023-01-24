import { IMessageRepository } from '../irepositories/messages'
import { MessageToModel } from '../../data/models/messages'
import { QueryParams } from '@stranerd/api-commons'

export class MessagesUseCase {
	private repository: IMessageRepository

	constructor (repository: IMessageRepository) {
		this.repository = repository
	}

	async add (data: MessageToModel) {
		return await this.repository.add(data)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, userId: string, data: Partial<MessageToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async delete (data: { id: string, userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}

	async markRead (input: { from: string, sessionId: string }) {
		return await this.repository.markRead(input.from, input.sessionId)
	}

	async deleteSessionMessages (sessionId: string) {
		return await this.repository.deleteSessionMessages(sessionId)
	}
}