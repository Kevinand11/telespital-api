import { makeController, Route, StatusCodes } from 'equipped'
import { OrdersController } from '../../controllers/users/orders'
import { isAuthenticated } from '@application/middlewares'

export const ordersRoutes: Route[] = [
	{
		path: '/users/orders/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrdersController.getOrders(req)
				}
			})
		]
	},
	{
		path: '/users/orders/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrdersController.findOrder(req)
				}
			})
		]
	},
	{
		path: '/users/orders/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrdersController.createOrder(req)
				}
			})
		]
	},
	{
		path: '/users/orders/:id/pay',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrdersController.payForOrder(req)
				}
			})
		]
	}
]