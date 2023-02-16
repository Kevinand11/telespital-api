import { TransactionEntity, TransactionFromModel, TransactionStatus } from '@modules/payment'
import { appInstance } from '@utils/environment'
import { fulfillTransaction } from '@utils/modules/payment/transactions'
import { ChangeStreamCallbacks } from 'equipped'

export const TransactionChangeStreamCallbacks: ChangeStreamCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(`payment/transactions/${after.userId}`, after)
		await appInstance.listener.created(`payment/transactions/${after.id}/${after.userId}`, after)

		if (after.status === TransactionStatus.fulfilled) await fulfillTransaction(after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(`payment/transactions/${after.userId}`, after)
		await appInstance.listener.updated(`payment/transactions/${after.id}/${after.userId}`, after)

		if (changes.status) {
			if (before.status === TransactionStatus.initialized && after.status === TransactionStatus.fulfilled) await fulfillTransaction(after)
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(`payment/transactions/${before.userId}`, before)
		await appInstance.listener.deleted(`payment/transactions/${before.id}/${before.userId}`, before)
	}
}