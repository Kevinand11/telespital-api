import { makeController, Route, StatusCodes } from 'equipped'
import { TransactionsController } from '@application/controllers/payment/transactions'
import { isAuthenticated } from '@application/middlewares'

export const transactionsRoutes: Route[] = [
	{
		path: '/payment/transactions',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/transactions/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.find(req)
				}
			})
		]
	}
]