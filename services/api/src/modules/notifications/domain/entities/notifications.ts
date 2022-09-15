import { BaseEntity } from '@stranerd/api-commons'
import { NotificationData } from '../types'

export class NotificationEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly body: string
	public readonly data: NotificationData
	public readonly userId: string
	public readonly seen: boolean
	public readonly sendEmail: boolean
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id,
		             title,
		             body,
		             data,
		             userId,
		             sendEmail,
		             createdAt,
		             seen,
		             updatedAt
	             }: NotificationConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.body = body
		this.data = data ?? {}
		this.userId = userId
		this.seen = seen
		this.sendEmail = sendEmail
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type NotificationConstructorArgs = {
	id: string, title: string, body: string, userId: string, data: NotificationData
	createdAt: number, seen: boolean, updatedAt: number, sendEmail: boolean
}
