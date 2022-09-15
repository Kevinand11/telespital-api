import { INotificationRepository } from '../irepositories/notifications'
import { NotificationToModel } from '../../data/models/notifications'
import { QueryParams } from '@stranerd/api-commons'

export class NotificationsUseCase {
	repository: INotificationRepository

	constructor (repo: INotificationRepository) {
		this.repository = repo
	}

	async find (input: { userId: string, id: string }) {
		return await this.repository.findNotification(input)
	}

	async get (input: QueryParams) {
		return await this.repository.getNotifications(input)
	}

	async create (input: NotificationToModel[]) {
		return await this.repository.createNotification(input)
	}

	async deleteOldSeen () {
		return await this.repository.deleteOldSeenNotifications()
	}

	async markSeen (input: { userId: string, ids: string[], seen: boolean }) {
		return await this.repository.markNotificationsSeen(input)
	}
}