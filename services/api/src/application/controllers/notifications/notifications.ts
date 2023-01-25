import { NotificationsUseCases, NotificationType } from '@modules/notifications'
import { NotAuthorizedError, NotFoundError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { sendNotification } from '@utils/modules/notifications/notifications'
import { UsersUseCases } from '@modules/users'
import { AuthUserType } from '@modules/auth'
import { AuthRole } from '@utils/types'

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
		const { title, message, userId } = validate({
			title: req.body.title,
			message: req.body.message,
			userId: req.body.userId
		}, {
			title: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			message: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			userId: { required: true, rules: [Validation.isString] }
		})

		const user = await UsersUseCases.find(userId)
		if (!user) throw new NotFoundError('user not found')
		if (user.bio.type === AuthUserType.patient && !req.authUser!.roles[AuthRole.canSendPatientNotification]) throw new NotAuthorizedError('insufficient permissions')
		if (user.bio.type === AuthUserType.doctor && !req.authUser!.roles[AuthRole.canSendDoctorNotification]) throw new NotAuthorizedError('insufficient permissions')

		return await sendNotification([userId], {
			title, body: message, sendEmail: false,
			data: { type: NotificationType.AdminMessage, adminId: req.authUser!.id }
		})
	}

	static async markNotificationSeen (req: Request) {
		const data = validate({
			seen: req.body.seen
		}, {
			seen: { required: true, rules: [Validation.isBoolean] }
		})

		await NotificationsUseCases.markSeen({
			ids: [req.params.id],
			userId: req.authUser!.id,
			seen: !!data.seen
		})

		return true
	}
}