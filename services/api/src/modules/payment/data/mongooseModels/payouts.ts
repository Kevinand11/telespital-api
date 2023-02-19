import { PayoutDbChangeCallbacks } from '@utils/changeStreams/payment/payouts'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { PayoutEntity } from '../../domain/entities/payouts'
import { PayoutMapper } from '../mappers/payouts'
import { PayoutFromModel } from '../models/payouts'

const PayoutSchema = new mongoose.Schema<PayoutFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	pay: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: {}
	},
	settlement: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: null
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

export const Payout = mongoose.model<PayoutFromModel>('PaymentPayout', PayoutSchema)

export const PayoutChange = appInstance.db
	.generateDbChange<PayoutFromModel, PayoutEntity>(Payout, PayoutDbChangeCallbacks, new PayoutMapper().mapFrom)