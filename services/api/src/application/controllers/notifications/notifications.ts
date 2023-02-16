import { AuthUserType } from '@modules/auth'
import { NotificationsUseCases, NotificationType } from '@modules/notifications'
import { UsersUseCases } from '@modules/users'
import { checkPermissions } from '@utils/modules/auth'
import { sendNotification } from '@utils/modules/notifications/notifications'
import { AuthRole, NotFoundError, QueryParams, Request, Schema, validateReq } from 'equipped'

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
		const { title, message, userId } = validateReq({
			title: Schema.string().min(1),
			message: Schema.string().min(1),
			userId: Schema.string().min(1)
		}, req.body)

		const user = await UsersUseCases.find(userId)
		if (!user) throw new NotFoundError('user not found')
		if (user.bio.type === AuthUserType.patient) checkPermissions(req.authUser, [AuthRole.canSendPatientNotification])
		if (user.bio.type === AuthUserType.doctor) checkPermissions(req.authUser, [AuthRole.canSendDoctorNotification])

		return await sendNotification([userId], {
			title, body: message, sendEmail: false,
			data: { type: NotificationType.AdminMessage, adminId: req.authUser!.id }
		})
	}

	static async markNotificationSeen (req: Request) {
		const data = validateReq({
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