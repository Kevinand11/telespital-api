import { MessageDbChangeCallbacks } from '@utils/changeStreams/sessions/messages'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { MessageEntity } from '../../domain/entities/messages'
import { MessageMapper } from '../mappers/messages'
import { MessageFromModel } from '../models/messages'

const Schema = new mongoose.Schema<MessageFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	from: {
		type: String,
		required: true
	},
	sessionId: {
		type: String,
		required: true
	},
	members: {
		type: [String],
		required: true
	},
	body: {
		type: String,
		required: false,
		default: ''
	},
	media: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: null
	},
	readAt: {
		type: mongoose.Schema.Types.Mixed as unknown as MessageFromModel['readAt'],
		required: false,
		default: {}
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

export const Message = mongoose.model<MessageFromModel>('SessionsMessage', Schema)

export const MessageChange = appInstance.db
	.generateDbChange<MessageFromModel, MessageEntity>(Message, MessageDbChangeCallbacks, new MessageMapper().mapFrom)
