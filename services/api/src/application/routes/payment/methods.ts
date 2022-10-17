import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { MethodsController } from '@application/controllers/payment/methods'
import { isAuthenticated } from '@application/middlewares'

export const methodsRoutes: Route[] = [
	{
		path: '/payment/methods/tokens',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.getTokens(req)
				}
			})
		]
	},
	{
		path: '/payment/methods',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/methods/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.find(req)
				}
			})
		]
	},
	{
		path: '/payment/methods/:id/primary',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.makePrimary(req)
				}
			})
		]
	},
	{
		path: '/payment/methods/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.delete(req)
				}
			})
		]
	},
	{
		path: '/payment/methods/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.create(req)
				}
			})
		]
	}
]