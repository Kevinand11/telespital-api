import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { PayoutFromModel } from '../models/payouts'
import { PayoutChangeStreamCallbacks } from '@utils/changeStreams/payment/payouts'
import { PayoutEntity } from '../../domain/entities/payouts'
import { PayoutMapper } from '../mappers/payouts'

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

generateChangeStreams<PayoutFromModel, PayoutEntity>(Payout, PayoutChangeStreamCallbacks, new PayoutMapper().mapFrom).then()