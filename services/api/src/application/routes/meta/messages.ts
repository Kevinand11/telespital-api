import { makeController, Route, StatusCodes } from 'equipped'
import { MessageController } from '@application/controllers/meta/messages'

export const messagesRoutes: Route[] = [
	{
		path: '/meta/messages',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MessageController.createMessage(req)
				}
			})
		]
	}
]