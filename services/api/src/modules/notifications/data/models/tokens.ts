export interface TokenFromModel extends TokenToModel {
	_id: string
	tokens: string[]
	createdAt: number
	updatedAt: number
}

export interface TokenToModel {
	userId: string
}