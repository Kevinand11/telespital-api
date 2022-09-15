import { BaseEntity } from '@stranerd/api-commons'

export class TokenEntity extends BaseEntity {
	public readonly id: string
	public readonly tokens: string[]
	public readonly userId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor (data: TokenConstructor) {
		super()
		this.id = data.id
		this.tokens = data.tokens
		this.userId = data.userId
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}
}

type TokenConstructor = {
	id: string
	tokens: string[],
	userId: string,
	createdAt: number
	updatedAt: number
}