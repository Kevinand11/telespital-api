import { ErrorDbChangeCallbacks } from '@utils/changeStreams/notifications/errors'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { ErrorEntity } from '../../domain/entities/errors'
import { ErrorMapper } from '../mappers/errors'
import { ErrorFromModel } from '../models/errors'

const Schema = new mongoose.Schema<ErrorFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
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
		type: mongoose.Schema.Types.Mixed as unknown as ErrorFromModel['data'],
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

export const Error = mongoose.model<ErrorFromModel>('NotificationsEmailsError', Schema)

export const ErrorChange = appInstance.db
	.generateDbChange<ErrorFromModel, ErrorEntity>(Error, ErrorDbChangeCallbacks, new ErrorMapper().mapFrom)