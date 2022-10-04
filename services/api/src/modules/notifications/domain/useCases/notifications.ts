import { INotificationRepository } from '../irepositories/notifications'
import { NotificationToModel } from '../../data/models/notifications'
import { QueryParams } from '@stranerd/api-commons'

export class NotificationsUseCase {
	repository: INotificationRepository

	constructor (repo: INotificationRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async create (input: NotificationToModel[]) {
		return await this.repository.create(input)
	}

	async deleteOldSeen () {
		return await this.repository.deleteOldSeen()
	}

	async markSeen (input: { userId: string, ids: string[], seen: boolean }) {
		return await this.repository.markSeen(input)
	}
}