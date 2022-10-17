import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { MethodEntity, MethodFromModel } from '@modules/payment'
import { getSocketEmitter } from '@index'
import { BraintreePayment } from '@utils/modules/payment/braintree'

export const MethodChangeStreamCallbacks: ChangeStreamCallbacks<MethodFromModel, MethodEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`payment/methods/${after.userId}`, after)
		await getSocketEmitter().emitCreated(`payment/methods/${after.id}/${after.userId}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated(`payment/methods/${after.userId}`, after)
		await getSocketEmitter().emitUpdated(`payment/methods/${after.id}/${after.userId}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`payment/methods/${before.userId}`, before)
		await getSocketEmitter().emitDeleted(`payment/methods/${before.id}/${before.userId}`, before)
		await BraintreePayment.deletePaymentMethod(before.token)
	}
}