import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { WalletEntity, WalletFromModel } from '@modules/payment'
import { getSocketEmitter } from '@index'

export const WalletChangeStreamCallbacks: ChangeStreamCallbacks<WalletFromModel, WalletEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`payment/wallets/${after.userId}`, after)
		await getSocketEmitter().emitCreated(`payment/wallets/${after.id}/${after.userId}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated(`payment/wallets/${after.userId}`, after)
		await getSocketEmitter().emitUpdated(`payment/wallets/${after.id}/${after.userId}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`payment/wallets/${before.userId}`, before)
		await getSocketEmitter().emitDeleted(`payment/wallets/${before.id}/${before.userId}`, before)
	}
}