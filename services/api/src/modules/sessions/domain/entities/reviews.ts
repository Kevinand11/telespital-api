import { EmbeddedUser } from '../types'
import { BaseEntity } from 'equipped'
import { generateDefaultUser } from '@modules/users'

export class ReviewEntity extends BaseEntity {
	public readonly id: string
	public readonly sessionId: string
	public readonly to: string
	public readonly user: EmbeddedUser
	public readonly rating: number
	public readonly message: string
	public readonly createdAt: number
	public readonly updatedAt: number

	ignoreInJSON = ['user.bio.email']

	constructor ({
		id, sessionId, to, user, rating, message, createdAt, updatedAt
	}: ReviewConstructorArgs) {
		super()
		this.id = id
		this.sessionId = sessionId
		this.to = to
		this.user = generateDefaultUser(user)
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