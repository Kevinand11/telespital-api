import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { NotificationsController } from '../../controllers/notifications/notifications'
import { isAuthenticated } from '@application/middlewares'

export const notificationsRoutes: Route[] = [
	{
		path: '/notifications/notifications/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await NotificationsController.getNotifications(req)
				}
			})
		]
	},
	{
		path: '/notifications/notifications/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await NotificationsController.findNotification(req)
				}
			})
		]
	},
	{
		path: '/notifications/notifications/:id/seen',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await NotificationsController.markNotificationSeen(req)
				}
			})
		]
	}
]