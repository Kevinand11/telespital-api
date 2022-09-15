import { NotificationsUseCases, NotificationToModel } from '@modules/notifications'

export const sendNotification = async (userIds: string[], data: Omit<NotificationToModel, 'userId'>) => {
	await NotificationsUseCases.create(userIds.map((userId) => ({ ...data, userId })))
}
