import { BaseMapper } from '@stranerd/api-commons'
import { ErrorFromModel, ErrorToModel } from '../models/errors'
import { ErrorEntity } from '../../domain/entities/errors'

export class ErrorMapper extends BaseMapper<ErrorFromModel, ErrorToModel, ErrorEntity> {
	mapFrom (model: ErrorFromModel | null) {
		if (!model) return null
		const {
			_id, content, subject, to, from, error, data,
			createdAt, updatedAt
		} = model
		return new ErrorEntity({
			id: _id.toString(),
			content, subject, to, from, error, data,
			createdAt, updatedAt
		})
	}

	mapTo (entity: ErrorEntity) {
		return {
			content: entity.content,
			subject: entity.subject,
			to: entity.to,
			from: entity.from,
			error: entity.error,
			data: entity.data
		}
	}
}
