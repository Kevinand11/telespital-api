import { UsersUseCases } from '@modules/users'
import { NotFoundError, QueryParams, Request } from '@stranerd/api-commons'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (!user) throw new NotFoundError()
		return user
	}
}