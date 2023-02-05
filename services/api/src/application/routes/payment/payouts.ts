import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { PayoutsController } from '@application/controllers/payment/payouts'
import { isAuthenticated } from '@application/middlewares'

export const payoutsRoutes: Route[] = [
	{
		path: '/payment/payouts',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PayoutsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/payouts/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PayoutsController.find(req)
				}
			})
		]
	},
	{
		path: '/payment/payouts/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PayoutsController.create(req)
				}
			})
		]
	}
]