import { generateChangeStreams, mongoose } from 'equipped'
import { NotificationFromModel } from '../models/notifications'
import { NotificationChangeStreamCallbacks } from '@utils/changeStreams/notifications/notifications'
import { NotificationEntity } from '../../domain/entities/notifications'
import { NotificationMapper } from '../mappers/notifications'

const NotificationSchema = new mongoose.Schema<NotificationFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	title: {
		type: String,
		required: false,
		default: ''
	},
	body: {
		type: String,
		required: true
	},
	seen: {
		type: Boolean,
		required: false,
		default: false
	},
	sendEmail: {
		type: Boolean,
		required: false,
		default: false
	},
	data: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
		default: {}
	},
	userId: {
		type: String,
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

export const Notification = mongoose.model<NotificationFromModel>('Notification', NotificationSchema)

generateChangeStreams<NotificationFromModel, NotificationEntity>(Notification, NotificationChangeStreamCallbacks, new NotificationMapper().mapFrom).then()