import { UserPhone } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class OrderEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly phone: UserPhone
	public readonly street: string
	public readonly city: string
	public readonly state: string
	public readonly country: string
	public readonly description: string

	constructor ({
		             id, userId, phone, street, city, state, country, description
	             }: OrderConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.phone = phone
		this.street = street
		this.city = city
		this.state = state
		this.country = country
		this.description = description
	}
}

type OrderConstructorArgs = {
	id: string
	userId: string
	phone: UserPhone
	street: string
	city: string
	state: string
	country: string
	description: string
}