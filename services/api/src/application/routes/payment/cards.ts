import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { CardsController } from '@application/controllers/payment/cards'

export const cardsRoutes: Route[] = [
	{
		path: '/payment/cards',
		method: 'get',
		controllers: [
			requireAuthUser,
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
			requireAuthUser,
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
			requireAuthUser,
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
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CardsController.delete(req)
				}
			})
		]
	}
]