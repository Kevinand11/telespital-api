import { ReviewDbChangeCallbacks } from '@utils/changeStreams/sessions/reviews'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { ReviewEntity } from '../../domain/entities/reviews'
import { ReviewMapper } from '../mappers/reviews'
import { ReviewFromModel } from '../models/reviews'

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

export const ReviewChange = appInstance.db
	.generateDbChange<ReviewFromModel, ReviewEntity>(Review, ReviewDbChangeCallbacks, new ReviewMapper().mapFrom)