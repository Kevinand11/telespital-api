import { BaseMapper } from '@stranerd/api-commons'
import { ReviewEntity } from '../../domain/entities/reviews'
import { ReviewFromModel, ReviewToModel } from '../models/reviews'

export class ReviewMapper extends BaseMapper<ReviewFromModel, ReviewToModel, ReviewEntity> {
	mapFrom (param: ReviewFromModel | null) {
		return !param ? null : new ReviewEntity({
			id: param._id.toString(),
			sessionId: param.sessionId,
			to: param.to,
			user: param.user,
			rating: param.rating,
			message: param.message,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: ReviewEntity) {
		return {
			sessionId: param.sessionId,
			to: param.to,
			user: param.user,
			rating: param.rating,
			message: param.message
		}
	}
}