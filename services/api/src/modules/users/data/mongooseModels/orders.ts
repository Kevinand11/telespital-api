import { OrderDbChangeCallbacks } from '@utils/changeStreams/users/orders'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { OrderEntity } from '../../domain/entities/orders'
import { OrderMapper } from '../mappers/orders'
import { OrderFromModel } from '../models/orders'

const OrderSchema = new mongoose.Schema<OrderFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: false,
		default: ''
	},
	paid: {
		type: Boolean,
		required: false,
		default: false
	},
	phone: {
		type: mongoose.Schema.Types.Mixed as unknown as OrderFromModel['phone'],
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

export const Order = mongoose.model<OrderFromModel>('UsersOrder', OrderSchema)

export const OrderChange = appInstance.db
	.generateDbChange<OrderFromModel, OrderEntity>(Order, OrderDbChangeCallbacks, new OrderMapper().mapFrom)