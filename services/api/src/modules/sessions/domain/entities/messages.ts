import { Media } from '../types'
import { BaseEntity } from 'equipped'

export class MessageEntity extends BaseEntity {
	public readonly id: string
	public readonly from: string
	public readonly sessionId: string
	public readonly members: string[]
	public readonly body: string
	public readonly media: Media | null
	public readonly createdAt: number
	public readonly updatedAt: number
	public readonly readAt: Record<string, number>

	constructor ({ id, from, sessionId, members, body, media, createdAt, updatedAt, readAt }: MessageConstructorArgs) {
		super()
		this.id = id
		this.from = from
		this.sessionId = sessionId
		this.members = members
		this.body = body
		this.media = media
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.readAt = readAt
	}
}

type MessageConstructorArgs = {
	id: string
	from: string
	sessionId: string
	members: string[]
	body: string
	media: Media | null
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
}
