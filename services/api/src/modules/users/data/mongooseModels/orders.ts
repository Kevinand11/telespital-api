import { OrderDbChangeCallbacks } from '@utils/changeStreams/users/orders'
import { appInstance } from '@utils/environment'
import { OrderMapper } from '../mappers/orders'
import { OrderFromModel } from '../models/orders'

const OrderSchema = new appInstance.dbs.mongo.Schema<OrderFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: false,
		default: ''
	},
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	paid: {
		type: Boolean,
		required: false,
		default: false
	},
	phone: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	street: {
		type: String,
		required: false,
		default: ''
	},
	city: {
		type: String,
		required: false,
		default: ''
	},
	state: {
		type: String,
		required: false,
		default: ''
	},
	country: {
		type: String,
		required: false,
		default: ''
	},
	description: {
		type: String,
		required: false,
		default: ''
	}
}, { minimize: false })

export const Order = appInstance.dbs.mongo.use().model<OrderFromModel>('UsersOrder', OrderSchema)

export const OrderChange = appInstance.dbs.mongo.change(Order, OrderDbChangeCallbacks, new OrderMapper().mapFrom)