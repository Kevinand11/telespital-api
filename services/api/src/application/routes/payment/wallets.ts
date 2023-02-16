import { makeController, Route, StatusCodes } from 'equipped'
import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'

export const walletsRoutes: Route[] = [
	{
		path: '/payment/wallets',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.get(req)
				}
			})
		]
	}
]