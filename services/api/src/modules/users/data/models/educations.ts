import { Media } from '../../domain/types'

export interface EducationFromModel extends EducationToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface EducationToModel {
	userId: string
	school: string
	degree: string
	from: number
	to: number
	verification: Media
}
