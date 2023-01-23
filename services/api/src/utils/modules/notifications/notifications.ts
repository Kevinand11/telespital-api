import { NotificationsUseCases, NotificationToModel } from '@modules/notifications'

export const sendNotification = async (userIds: string[], data: Omit<NotificationToModel, 'userId'>) => {
	const notifications = await NotificationsUseCases.create(userIds.map((userId) => ({ ...data, userId })))
	return !!notifications.length
}
