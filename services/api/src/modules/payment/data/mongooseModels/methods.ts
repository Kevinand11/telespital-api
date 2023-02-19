import { MethodDbChangeCallbacks } from '@utils/changeStreams/payment/methods'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { MethodEntity } from '../../domain/entities/methods'
import { MethodMapper } from '../mappers/methods'
import { MethodFromModel } from '../models/methods'

const MethodSchema = new mongoose.Schema<MethodFromModel>({
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
	token: {
		type: String,
		required: true
	},
	data: {
		type: mongoose.Schema.Types.Mixed,
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

export const Method = mongoose.model<MethodFromModel>('PaymentMethod', MethodSchema)

export const MethodChange = appInstance.db
	.generateDbChange<MethodFromModel, MethodEntity>(Method, MethodDbChangeCallbacks, new MethodMapper().mapFrom)