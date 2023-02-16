import { WalletsUseCases } from '@modules/payment'
import { Request } from 'equipped'

export class WalletsController {
	static async get (req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}
}