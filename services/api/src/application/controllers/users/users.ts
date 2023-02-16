import { UsersUseCases } from '@modules/users'
import { QueryParams, Request } from 'equipped'
import { AuthUserType } from '@modules/auth'

export class UsersController {
	static async getPatients (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'bio.type', value: AuthUserType.patient }]
		return await UsersUseCases.get(query)
	}

	static async getDoctors (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'bio.type', value: AuthUserType.doctor }]
		return await UsersUseCases.get(query)
	}

	static async getAdmins (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'bio.type', value: AuthUserType.admin }]
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		return user
	}
}