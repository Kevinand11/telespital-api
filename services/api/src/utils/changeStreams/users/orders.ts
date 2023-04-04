import { OrderEntity, OrderFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const OrderDbChangeCallbacks: DbChangeCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['users/orders', `users/orders/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.created(['users/orders', `users/orders/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(['users/orders', `users/orders/${before.id}`], before)
	}
}
