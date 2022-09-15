import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { TransactionEntity, TransactionFromModel, TransactionStatus } from '@modules/payment'
import { getSocketEmitter } from '@index'
import { fulfillTransaction } from '@utils/modules/payment/transactions'

export const TransactionChangeStreamCallbacks: ChangeStreamCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`payment/transactions/${after.userId}`, after)
		await getSocketEmitter().emitCreated(`payment/transactions/${after.id}/${after.userId}`, after)

		if (after.status === TransactionStatus.fulfilled) await fulfillTransaction(after)
	},
	updated: async ({ after, before, changes }) => {
		await getSocketEmitter().emitUpdated(`payment/transactions/${after.userId}`, after)
		await getSocketEmitter().emitUpdated(`payment/transactions/${after.id}/${after.userId}`, after)

		if (changes.status) {
			if (before.status === TransactionStatus.initialized && after.status === TransactionStatus.fulfilled) await fulfillTransaction(after)
		}
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`payment/transactions/${before.userId}`, before)
		await getSocketEmitter().emitDeleted(`payment/transactions/${before.id}/${before.userId}`, before)
	}
}