import { BaseEntity } from '@stranerd/api-commons'
import { EmbeddedUser, Media } from '../types'

export class AnswerEntity extends BaseEntity {
	public readonly id: string
	public readonly questionId: string
	public readonly attachment: Media
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, questionId, user, attachment, createdAt, updatedAt
	             }: AnswerConstructorArgs) {
		super()
		this.id = id
		this.questionId = questionId
		this.user = user
		this.attachment = attachment
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type AnswerConstructorArgs = {
	id: string
	questionId: string
	attachment: Media
	createdAt: number
	updatedAt: number
	user: EmbeddedUser
}
