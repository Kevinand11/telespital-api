import {
	CardsUseCases,
	Currencies,
	TransactionEntity,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { FlutterwavePayment } from '@utils/modules/payment/flutterwave'
import { Conditions } from '@stranerd/api-commons'

export const fulfillTransaction = async (transaction: TransactionEntity) => {
	if (transaction.data.type === TransactionType.NewCard) {
		const fTransaction = await FlutterwavePayment.getTransactionByRef(transaction.id)
		if (!fTransaction) return
		const [month, year] = fTransaction.card.expiry.split('/').map((x) => parseInt(x))
		await CardsUseCases.create({
			userId: transaction.userId,
			last4Digits: fTransaction.card.last_4digits,
			issuer: fTransaction.card.issuer,
			country: fTransaction.card.country,
			type: fTransaction.card.type,
			token: fTransaction.card.token,
			expiredAt: new Date(2000 + year, month).getTime()
		})
		await WalletsUseCases.updateAmount({
			userId: transaction.userId,
			amount: await FlutterwavePayment.convertAmount(transaction.amount, transaction.currency, Currencies.USD)
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
	}
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