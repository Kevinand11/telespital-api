import { generateChangeStreams, mongoose } from 'equipped'
import { TokenFromModel } from '../models/tokens'
import { TokenChangeStreamCallbacks } from '@utils/changeStreams/notifications/tokens'
import { TokenEntity } from '../../domain/entities/tokens'
import { TokenMapper } from '../mappers/tokens'

const Schema = new mongoose.Schema<TokenFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	tokens: {
		type: [String],
		required: false,
		default: []
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
}, { timestamps: { currentTime: Date.now } })

export const Token = mongoose.model<TokenFromModel>('NotificationsToken', Schema)

generateChangeStreams<TokenFromModel, TokenEntity>(Token, TokenChangeStreamCallbacks, new TokenMapper().mapFrom).then()