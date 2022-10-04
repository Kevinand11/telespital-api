import { NotificationEntity } from '../entities/notifications'
import { NotificationToModel } from '../../data/models/notifications'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface INotificationRepository {
	find (id: string): Promise<NotificationEntity | null>

	create (data: NotificationToModel[]): Promise<NotificationEntity[]>

	markSeen (data: { userId: string, ids: string[], seen: boolean }): Promise<void>

	deleteOldSeen (): Promise<void>

	get (query: QueryParams): Promise<QueryResults<NotificationEntity>>
}