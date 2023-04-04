import { ErrorDbChangeCallbacks } from '@utils/changeStreams/notifications/errors'
import { appInstance } from '@utils/environment'
import { ErrorMapper } from '../mappers/errors'
import { ErrorFromModel } from '../models/errors'

const Schema = new appInstance.dbs.mongo.Schema<ErrorFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	error: {
		type: String,
		required: true
	},
	subject: {
		type: String,
		required: true
	},
	from: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	data: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {} as unknown as ErrorFromModel['data']
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

export const Error = appInstance.dbs.mongo.use().model<ErrorFromModel>('NotificationsEmailsError', Schema)

export const ErrorChange = appInstance.dbs.mongo.change(Error, ErrorDbChangeCallbacks, new ErrorMapper().mapFrom)