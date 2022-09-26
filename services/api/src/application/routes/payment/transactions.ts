import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { TransactionsController } from '@application/controllers/payment/transactions'
import { isAuthenticated } from '@application/middlewares'

export const transactionsRoutes: Route[] = [
	{
		path: '/payment/transactions/flutterwave/secrets',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.getSecrets(req)
				}
			})
		]
	},
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
	},
	{
		path: '/payment/transactions',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.create(req)
				}
			})
		]
	},
	{
		path: '/payment/transactions/:id/fulfill',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.fulfill(req)
				}
			})
		]
	}
]