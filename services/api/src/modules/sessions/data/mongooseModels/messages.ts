import { MessageDbChangeCallbacks } from '@utils/changeStreams/sessions/messages'
import { appInstance } from '@utils/environment'
import { MessageMapper } from '../mappers/messages'
import { MessageFromModel } from '../models/messages'

const Schema = new appInstance.dbs.mongo.Schema<MessageFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
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
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	readAt: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
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

export const Message = appInstance.dbs.mongo.use().model<MessageFromModel>('SessionsMessage', Schema)

export const MessageChange = appInstance.dbs.mongo.change(Message, MessageDbChangeCallbacks, new MessageMapper().mapFrom)
