import { QuestionFromModel, QuestionToModel } from '../models/questions'
import { QuestionEntity } from '../../domain/entities/questions'
import { BaseMapper } from '@stranerd/api-commons'

export class QuestionMapper extends BaseMapper<QuestionFromModel, QuestionToModel, QuestionEntity> {
	mapFrom (model: QuestionFromModel | null) {
		if (!model) return null
		const {
			_id, body, subjectId, topic, attachment,
			user, answers, heldBy, createdAt, updatedAt
		} = model
		return new QuestionEntity({
			id: _id.toString(), body, subjectId, topic, attachment,
			user, answers, heldBy, createdAt, updatedAt
		})
	}

	mapTo (entity: QuestionEntity) {
		return {
			body: entity.body,
			attachment: entity.attachment,
			subjectId: entity.subjectId,
			topic: entity.topic,
			user: entity.user
		}
	}
}
