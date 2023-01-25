import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { NotificationsController } from '../../controllers/notifications/notifications'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { AuthRole } from '@utils/types'

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
		path: '/notifications/notifications/',
		method: 'post',
		controllers: [
			isAdmin([AuthRole.canSendPatientNotification, AuthRole.canSendDoctorNotification]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await NotificationsController.createNotification(req)
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