import { Currencies, UserPhone } from '../../domain/types'

export interface OrderFromModel extends OrderToModel {
	_id: string
	paid: boolean
}

export interface OrderToModel {
	amount: number
	currency: Currencies
	userId: string
	phone: UserPhone
	street: string
	city: string
	state: string
	country: string
	description: string
}