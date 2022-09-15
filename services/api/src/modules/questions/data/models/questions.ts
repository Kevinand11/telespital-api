import { EmbeddedUser, Media, QuestionHeld } from '../../domain/types'

export interface QuestionFromModel extends QuestionToModel {
	_id: string
	answers: { id: string, userId: string }[]
	heldBy: QuestionHeld
	createdAt: number
	updatedAt: number
}

export interface QuestionToModel {
	body: string
	attachment: Media | null
	subjectId: string
	topic: string
	user: EmbeddedUser
}
