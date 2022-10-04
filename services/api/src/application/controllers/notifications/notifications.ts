import { NotificationsUseCases } from '@modules/notifications'
import { QueryParams, Request, validate, Validation } from '@stranerd/api-commons'

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