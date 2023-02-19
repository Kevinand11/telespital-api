import { PayoutEntity, PayoutFromModel } from '@modules/payment'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const PayoutDbChangeCallbacks: DbChangeCallbacks<PayoutFromModel, PayoutEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('payment/payouts', after)
		await appInstance.listener.created(`payment/payouts/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('payment/payouts', after)
		await appInstance.listener.updated(`payment/payouts/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('payment/payouts', before)
		await appInstance.listener.deleted(`payment/payouts/${before.id}`, before)
	}
}