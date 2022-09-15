import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { TransactionsController } from '@application/controllers/payment/transactions'

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
			requireAuthUser,
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
			requireAuthUser,
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
			requireAuthUser,
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
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.fulfill(req)
				}
			})
		]
	}
]