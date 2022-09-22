export interface CardFromModel extends CardToModel {
	_id: string
	primary: boolean
	expired: boolean
	createdAt: number
	updatedAt: number
}

export interface CardToModel {
	last4Digits: string
	country: string
	type: string
	token: string
	expiredAt: number
	userId: string
}