import { AuthUserType } from '@modules/auth'
import { NotificationsUseCases, NotificationType } from '@modules/notifications'
import { UsersUseCases } from '@modules/users'
import { checkPermissions } from '@utils/modules/auth'
import { sendNotification } from '@utils/modules/notifications/notifications'
import { AuthRole, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class NotificationsController {
	static async getNotifications (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await NotificationsUseCases.get(query)
	}

	static async findNotification (req: Request) {
		const notification = await NotificationsUseCases.find(req.params.id)
		if (!notification || notification.userId !== req.authUser!.id) return null
		return notification
	}

	static async createNotification (req: Request) {
		const { notifications } = validate({
			notifications: Schema.array(Schema.object({
				title: Schema.string().min(1),
				message: Schema.string().min(1),
				userId: Schema.string().min(1)
			})).min(1)
		}, req.body)

		const { results: users } = await UsersUseCases.get({ auth: [{ field: 'id', value: notifications.map((n) => n.userId) }] })

		users.forEach((user) => {
			if (user.bio.type === AuthUserType.patient && !checkPermissions(req.authUser, [AuthRole.canSendPatientNotification])) throw new NotAuthorizedError('cant send notifications to patients')
			if (user.bio.type === AuthUserType.doctor && !checkPermissions(req.authUser, [AuthRole.canSendDoctorNotification])) throw new NotAuthorizedError('cant send notifications to doctors')
		})

		const res =  await Promise.all(notifications.map((notification) => sendNotification([notification.userId], {
			title: notification.title, body: notification.message, sendEmail: false,
			data: { type: NotificationType.AdminMessage, adminId: req.authUser!.id }
		})))

		return res.every((r) => r)
	}

	static async markNotificationSeen (req: Request) {
		const data = validate({
			seen: Schema.boolean()
		}, req.body)

		await NotificationsUseCases.markSeen({
			ids: [req.params.id],
			userId: req.authUser!.id,
			seen: !!data.seen
		})

		return true
	}
}