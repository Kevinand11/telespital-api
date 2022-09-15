export interface SubjectFromModel extends SubjectToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface SubjectToModel {
	title: string
}
