import { NotificationsUseCases, NotificationToModel } from '@modules/notifications'

export const sendNotification = async (data: NotificationToModel[]) => {
	const notifications = await NotificationsUseCases.create(data)
	return !!notifications.length
}
