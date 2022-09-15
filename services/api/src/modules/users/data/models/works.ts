import { Media } from '../../domain/types'

export interface WorkFromModel extends WorkToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface WorkToModel {
	userId: string
	institution: string
	position: string
	from: number
	to: number
	verification: Media
}
