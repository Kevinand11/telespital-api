import { NotificationsUseCases, NotificationType } from '@modules/notifications'
import { QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { sendNotification } from '@utils/modules/notifications/notifications'

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
		const { title, message, userIds } = validate({
			title: req.body.title,
			message: req.body.message,
			userIds: req.body.userIds
		}, {
			title: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			message: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			userIds: {
				required: true,
				rules: [Validation.isArray, Validation.isArrayOfX((x) => Validation.isString(x).valid, 'userIds')]
			}
		})
		return await sendNotification(userIds, {
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