import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { ReviewFromModel } from '../models/reviews'
import { ReviewEntity } from '../../domain/entities/reviews'
import { ReviewMapper } from '../mappers/reviews'
import { ReviewChangeStreamCallbacks } from '@utils/changeStreams/sessions/reviews'

const ReviewSchema = new mongoose.Schema<ReviewFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	sessionId: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	message: {
		type: String,
		required: false,
		default: ''
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { minimize: false })

export const Review = mongoose.model<ReviewFromModel>('SessionsReview', ReviewSchema)

generateChangeStreams<ReviewFromModel, ReviewEntity>(Review, ReviewChangeStreamCallbacks, new ReviewMapper().mapFrom).then()