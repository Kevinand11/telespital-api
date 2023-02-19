import { WalletEntity, WalletFromModel } from '@modules/payment'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const WalletDbChangeCallbacks: DbChangeCallbacks<WalletFromModel, WalletEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(`payment/wallets/${after.userId}`, after)
		await appInstance.listener.created(`payment/wallets/${after.id}/${after.userId}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(`payment/wallets/${after.userId}`, after)
		await appInstance.listener.updated(`payment/wallets/${after.id}/${after.userId}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(`payment/wallets/${before.userId}`, before)
		await appInstance.listener.deleted(`payment/wallets/${before.id}/${before.userId}`, before)
	}
}