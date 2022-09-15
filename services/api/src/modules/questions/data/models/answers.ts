import { EmbeddedUser, Media } from '../../domain/types'

export interface AnswerFromModel extends AnswerToModel {
	_id: string
	best: boolean
	createdAt: number
	updatedAt: number
}

export interface AnswerToModel {
	attachment: Media
	questionId: string
	user: EmbeddedUser
}
