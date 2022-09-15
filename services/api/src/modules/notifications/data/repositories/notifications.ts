import { INotificationRepository } from '../../domain/irepositories/notifications'
import { NotificationMapper } from '../mappers/notifications'
import { Notification } from '../mongooseModels/notifications'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { NotificationFromModel, NotificationToModel } from '../models/notifications'

export class NotificationRepository implements INotificationRepository {
	private static instance: NotificationRepository
	private mapper = new NotificationMapper()

	static getInstance (): NotificationRepository {
		if (!NotificationRepository.instance) NotificationRepository.instance = new NotificationRepository()
		return NotificationRepository.instance
	}

	async getNotifications (query: QueryParams) {
		const data = await parseQueryParams<NotificationFromModel>(Notification, query)
		return {
			...data,
			results: data.results.map((n) => this.mapper.mapFrom(n)!)
		}
	}

	async findNotification (data: { userId: string, id: string }) {
		const notification = await Notification.findOne({ _id: data.id, userId: data.userId })
		return this.mapper.mapFrom(notification)
	}

	async createNotification (data: NotificationToModel[]) {
		const notifications = await Notification.insertMany(data)
		return notifications.map((notification) => this.mapper.mapFrom(notification)!)
	}

	async markNotificationsSeen (data: { userId: string, ids: string[], seen: boolean }) {
		await Notification.findOneAndUpdate({
			userId: data.userId, _id: { $in: data.ids }
		}, { $set: { seen: data.seen } })
	}

	async deleteOldSeenNotifications () {
		const weekInMs = 1000 * 60 * 60 * 24 * 7
		await Notification.deleteMany({
			seen: true,
			createdAt: { $lte: Date.now() - weekInMs }
		})
	}
}