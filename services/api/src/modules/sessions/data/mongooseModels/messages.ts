import { generateChangeStreams, mongoose } from 'equipped'
import { MessageFromModel } from '../models/messages'
import { MessageEntity } from '../../domain/entities/messages'
import { MessageChangeStreamCallbacks } from '@utils/changeStreams/sessions/messages'
import { MessageMapper } from '../mappers/messages'

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

generateChangeStreams<MessageFromModel, MessageEntity>(Message, MessageChangeStreamCallbacks, new MessageMapper().mapFrom).then()
