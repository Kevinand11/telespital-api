import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { MessageController } from '../../controllers/sessions/messages'
import { isAuthenticated } from '@application/middlewares'

export const messageRoutes: Route[] = [
	{
		path: '/sessions/messages',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MessageController.getMessages(req)
				}
			})
		]
	},
	{
		path: '/sessions/messages/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MessageController.findMessage(req)
				}
			})
		]
	},
	{
		path: '/sessions/messages',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MessageController.addMessage(req)
				}
			})
		]
	},
	{
		path: '/sessions/messages/read',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MessageController.markMessageRead(req)
				}
			})
		]
	}
]