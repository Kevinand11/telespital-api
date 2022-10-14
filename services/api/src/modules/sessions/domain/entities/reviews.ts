import { EmbeddedUser } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class ReviewEntity extends BaseEntity {
	public readonly id: string
	public readonly sessionId: string
	public readonly to: string
	public readonly user: EmbeddedUser
	public readonly rating: number
	public readonly message: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, sessionId, to, user, rating, message, createdAt, updatedAt
	             }: ReviewConstructorArgs) {
		super()
		this.id = id
		this.sessionId = sessionId
		this.to = to
		this.user = user
		this.rating = rating
		this.message = message
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ReviewConstructorArgs = {
	id: string
	sessionId: string
	to: string
	user: EmbeddedUser
	rating: number
	message: string
	createdAt: number
	updatedAt: number
}