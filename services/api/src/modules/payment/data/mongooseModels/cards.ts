import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { CardFromModel } from '../models/cards'
import { CardChangeStreamCallbacks } from '@utils/changeStreams/payment/cards'
import { CardEntity } from '../../domain/entities/cards'
import { CardMapper } from '../mappers/cards'

const CardSchema = new mongoose.Schema<CardFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	primary: {
		type: Boolean,
		required: true,
		default: false
	},
	last4Digits: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	expiredAt: {
		type: Number,
		required: true
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
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Card = mongoose.model<CardFromModel>('PaymentCard', CardSchema)

generateChangeStreams<CardFromModel, CardEntity>(Card, CardChangeStreamCallbacks, new CardMapper().mapFrom).then()