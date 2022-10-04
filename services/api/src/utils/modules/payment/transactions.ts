import { TransactionEntity, TransactionStatus, TransactionsUseCases } from '@modules/payment'
import { Conditions } from '@stranerd/api-commons'

export const fulfillTransaction = async (transaction: TransactionEntity) => {
	console.log(transaction)
}

export const retryTransactions = async (timeInMs: number) => {
	const { results: fulfilledTransactions } = await TransactionsUseCases.get({
		where: [{ field: 'status', value: TransactionStatus.fulfilled },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }],
		all: true
	})
	await Promise.all(fulfilledTransactions.map(fulfillTransaction))

	const { results: initializedTransactions } = await TransactionsUseCases.get({
		where: [{ field: 'status', value: TransactionStatus.initialized },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }],
		all: true
	})
	await TransactionsUseCases.delete(initializedTransactions.map((t) => t.id))
}