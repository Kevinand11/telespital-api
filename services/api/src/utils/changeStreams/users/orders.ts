import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { OrderEntity, OrderFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'

export const OrderChangeStreamCallbacks: ChangeStreamCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('users/orders', after)
		await getSocketEmitter().emitCreated(`users/orders/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('users/orders', after)
		await getSocketEmitter().emitUpdated(`users/orders/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('users/orders', before)
		await getSocketEmitter().emitDeleted(`users/orders/${before.id}`, before)
	}
}
