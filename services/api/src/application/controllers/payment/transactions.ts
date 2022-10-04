import { TransactionsUseCases } from '@modules/payment'
import { QueryParams, Request } from '@stranerd/api-commons'
import { stripeConfig } from '@utils/environment'

export class TransactionsController {
	static async getSecrets (_: Request) {
		return { publicKey: stripeConfig.publicKey }
	}

	static async find (req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) return null
		return transaction
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await TransactionsUseCases.get(query)
	}
}