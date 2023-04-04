import { NotificationDbChangeCallbacks } from '@utils/changeStreams/notifications/notifications'
import { appInstance } from '@utils/environment'
import { NotificationMapper } from '../mappers/notifications'
import { NotificationFromModel } from '../models/notifications'

const NotificationSchema = new appInstance.dbs.mongo.Schema<NotificationFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
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
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
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

export const Notification = appInstance.dbs.mongo.use().model<NotificationFromModel>('Notification', NotificationSchema)

export const NotificationChange = appInstance.dbs.mongo.change(Notification, NotificationDbChangeCallbacks, new NotificationMapper().mapFrom)