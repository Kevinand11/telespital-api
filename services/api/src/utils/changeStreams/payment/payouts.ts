import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { PayoutEntity, PayoutFromModel } from '@modules/payment'
import { getSocketEmitter } from '@index'

export const PayoutChangeStreamCallbacks: ChangeStreamCallbacks<PayoutFromModel, PayoutEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('payment/payouts', after)
		await getSocketEmitter().emitCreated(`payment/payouts/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('payment/payouts', after)
		await getSocketEmitter().emitUpdated(`payment/payouts/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('payment/payouts', before)
		await getSocketEmitter().emitDeleted(`payment/payouts/${before.id}`, before)
	}
}