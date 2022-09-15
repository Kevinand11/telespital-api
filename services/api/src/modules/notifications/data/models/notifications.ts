import { NotificationData } from '../../domain/types'

export interface NotificationFromModel extends NotificationToModel {
	_id: string
	createdAt: number
	updatedAt: number
	seen: boolean
}

export interface NotificationToModel {
	title: string
	body: string
	userId: string
	sendEmail: boolean
	data: NotificationData
}