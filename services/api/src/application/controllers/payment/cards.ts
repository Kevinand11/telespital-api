import { CardsUseCases } from '@modules/payment'
import { NotAuthorizedError, QueryParams, Request } from '@stranerd/api-commons'

export class CardsController {
	static async find (req: Request) {
		return await CardsUseCases.find({ id: req.params.id, userId: req.authUser!.id })
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await CardsUseCases.get(query)
	}

	static async makePrimary (req: Request) {
		const updated = await CardsUseCases.makePrimary({ id: req.params.id, userId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete (req: Request) {
		const isDeleted = await CardsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}