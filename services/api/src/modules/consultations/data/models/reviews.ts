import { EmbeddedUser } from '../../domain/types'

export interface ReviewFromModel extends ReviewToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ReviewToModel {
	to: string
	consultationId: string
	user: EmbeddedUser
	rating: number
	message: string
}
