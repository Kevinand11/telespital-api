import { UserPhone } from '../../domain/types'

export interface OrderFromModel extends OrderToModel {
	_id: string
}

export interface OrderToModel {
	userId: string
	phone: UserPhone
	street: string
	city: string
	state: string
	country: string
	description: string
}