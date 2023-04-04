import { PayoutDbChangeCallbacks } from '@utils/changeStreams/payment/payouts'
import { appInstance } from '@utils/environment'
import { PayoutMapper } from '../mappers/payouts'
import { PayoutFromModel } from '../models/payouts'

const PayoutSchema = new appInstance.dbs.mongo.Schema<PayoutFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
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
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {}
	},
	settlement: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
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

export const Payout = appInstance.dbs.mongo.use().model<PayoutFromModel>('PaymentPayout', PayoutSchema)

export const PayoutChange = appInstance.dbs.mongo.change(Payout, PayoutDbChangeCallbacks, new PayoutMapper().mapFrom)