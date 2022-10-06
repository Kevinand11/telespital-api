import { UsersUseCases } from '@modules/users'
import { QueryParams, Request } from '@stranerd/api-commons'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		return await UsersUseCases.find(req.params.id)
	}
}