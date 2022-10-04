import { TransactionsUseCases } from '@modules/payment'
import { QueryParams, Request } from '@stranerd/api-commons'
import { stripeConfig } from '@utils/environment'

export class TransactionsController {
	static async getSecrets (_: Request) {
		return { publicKey: stripeConfig.publicKey }
	}

	static async find (req: Request) {
		return await TransactionsUseCases.find({ id: req.params.id, userId: req.authUser!.id })
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await TransactionsUseCases.get(query)
	}
}