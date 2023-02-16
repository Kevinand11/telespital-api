import { generateChangeStreams, mongoose } from 'equipped'
import { OrderFromModel } from '../models/orders'
import { OrderChangeStreamCallbacks } from '@utils/changeStreams/users/orders'
import { OrderEntity } from '../../domain/entities/orders'
import { OrderMapper } from '../mappers/orders'

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

generateChangeStreams<OrderFromModel, OrderEntity>(Order, OrderChangeStreamCallbacks, new OrderMapper().mapFrom).then()