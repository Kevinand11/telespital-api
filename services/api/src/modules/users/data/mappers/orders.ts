import { BaseMapper } from 'equipped'
import { OrderEntity } from '../../domain/entities/orders'
import { OrderFromModel, OrderToModel } from '../models/orders'

export class OrderMapper extends BaseMapper<OrderFromModel, OrderToModel, OrderEntity> {
	mapFrom (param: OrderFromModel | null) {
		return !param ? null : new OrderEntity({
			id: param._id.toString(),
			userId: param.userId,
			amount: param.amount,
			currency: param.currency,
			paid: param.paid,
			phone: param.phone,
			street: param.street,
			city: param.city,
			state: param.state,
			country: param.country,
			description: param.description
		})
	}

	mapTo (param: OrderEntity) {
		return {
			userId: param.userId,
			amount: param.amount,
			currency: param.currency,
			phone: param.phone,
			street: param.street,
			city: param.city,
			state: param.state,
			country: param.country,
			description: param.description
		}
	}
}