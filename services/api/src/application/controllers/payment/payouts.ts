import { AuthUserType } from '@modules/auth'
import { UsersUseCases } from '@modules/users'
import { PayoutsUseCases } from '@modules/payment'
import { QueryParams, Request } from 'equipped'

export class PayoutsController {
	static async find (req: Request) {
		const payout = await PayoutsUseCases.find(req.params.id)
		return payout
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await PayoutsUseCases.get(query)
	}

	static async create (req: Request) {
		const users = await UsersUseCases.get({
			where: [{ field: 'bio.type', value: AuthUserType.doctor }],
			all: true
		})
		return await PayoutsUseCases.create(req.authUser!.id, users.results.map((u) => u.getEmbedded()))
	}

	static async settle (req: Request) {
		return await PayoutsUseCases.settle({
			id: req.params.id,
			userId: req.authUser!.id
		})
	}
}