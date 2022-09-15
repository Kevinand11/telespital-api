import { NotificationEntity } from '../entities/notifications'
import { NotificationToModel } from '../../data/models/notifications'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface INotificationRepository {
	findNotification (data: { userId: string, id: string }): Promise<NotificationEntity | null>

	createNotification (data: NotificationToModel[]): Promise<NotificationEntity[]>

	markNotificationsSeen (data: { userId: string, ids: string[], seen: boolean }): Promise<void>

	deleteOldSeenNotifications (): Promise<void>

	getNotifications (query: QueryParams): Promise<QueryResults<NotificationEntity>>
}