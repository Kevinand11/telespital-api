import { PayoutsController } from '@application/controllers/payment/payouts'
import { isAdmin } from '@application/middlewares'
import { AuthRole, makeController, Route, StatusCodes } from '@stranerd/api-commons'

export const payoutsRoutes: Route[] = [
	{
		path: '/payment/payouts',
		method: 'get',
		controllers: [
			isAdmin([AuthRole.canViewPayment]),
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
			isAdmin([AuthRole.canViewPayment]),
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
			isAdmin([AuthRole.canGeneratePayment]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PayoutsController.create(req)
				}
			})
		]
	},
	{
		path: '/payment/payouts/:id/settle',
		method: 'post',
		controllers: [
			isAdmin([AuthRole.canGeneratePayment]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PayoutsController.settle(req)
				}
			})
		]
	}
]