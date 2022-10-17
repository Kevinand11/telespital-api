import { BaseEntity } from '@stranerd/api-commons'
import { MethodData } from '../types'

export class MethodEntity extends BaseEntity {
	public readonly id: string
	public readonly data: MethodData
	public readonly token: string
	public readonly primary: boolean
	public readonly userId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, data, token, primary, userId, createdAt, updatedAt
	             }: MethodConstructorArgs) {
		super()
		this.id = id
		this.data = data
		this.token = token
		this.primary = primary
		this.userId = userId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type MethodConstructorArgs = {
	id: string
	data: MethodData
	token: string
	primary: boolean
	userId: string
	createdAt: number
	updatedAt: number
}