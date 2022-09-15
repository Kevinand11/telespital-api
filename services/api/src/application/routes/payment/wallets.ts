import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { WalletsController } from '@application/controllers/payment/wallets'

export const walletsRoutes: Route[] = [
	{
		path: '/payment/wallets',
		method: 'get',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/wallets/banks/:country',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.getBanks(req)
				}
			})
		]
	},
	{
		path: '/payment/wallets/account',
		method: 'post',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.updateAccount(req)
				}
			})
		]
	}
]