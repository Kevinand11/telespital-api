import { OrderEntity } from '../entities/orders'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { OrderToModel } from '../../data/models/orders'

export interface IOrderRepository {
	get (query: QueryParams): Promise<QueryResults<OrderEntity>>

	add (data: OrderToModel): Promise<OrderEntity>

	find (orderId: string): Promise<OrderEntity | null>

	updatePaid (id: string, paid: boolean): Promise<boolean>
}