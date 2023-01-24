import { MessageFromModel, MessageToModel } from '../models/messages'
import { MessageEntity } from '../../domain/entities/messages'
import { BaseMapper } from '@stranerd/api-commons'

export class MessageMapper extends BaseMapper<MessageFromModel, MessageToModel, MessageEntity> {
	mapFrom (model: MessageFromModel | null) {
		if (!model) return null
		const { _id, from, sessionId, members, body, media, readAt, createdAt, updatedAt } = model
		return new MessageEntity({
			id: _id.toString(), from, sessionId, members, body, media,
			createdAt, updatedAt, readAt
		})
	}

	mapTo (entity: MessageEntity) {
		return {
			body: entity.body,
			from: entity.from,
			sessionId: entity.sessionId,
			members: entity.members,
			media: entity.media
		}
	}
}
