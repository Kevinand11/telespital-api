import { TransactionDbChangeCallbacks } from '@utils/changeStreams/payment/transactions'
import { appInstance } from '@utils/environment'
import { TransactionMapper } from '../mappers/transactions'
import { TransactionFromModel } from '../models/transactions'

const TransactionSchema = new appInstance.dbs.mongo.Schema<TransactionFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	status: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	data: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
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

export const Transaction = appInstance.dbs.mongo.use().model<TransactionFromModel>('PaymentTransaction', TransactionSchema)

export const TransactionChange = appInstance.dbs.mongo.change(Transaction, TransactionDbChangeCallbacks, new TransactionMapper().mapFrom)