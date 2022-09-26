import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { CardsController } from '@application/controllers/payment/cards'
import { isAuthenticated } from '@application/middlewares'

export const cardsRoutes: Route[] = [
	{
		path: '/payment/cards',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CardsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/cards/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CardsController.find(req)
				}
			})
		]
	},
	{
		path: '/payment/cards/:id/primary',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CardsController.makePrimary(req)
				}
			})
		]
	},
	{
		path: '/payment/cards/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CardsController.delete(req)
				}
			})
		]
	}
]