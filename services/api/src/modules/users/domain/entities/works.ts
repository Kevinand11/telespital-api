import { Media } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class WorkEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly institution: string
	public readonly position: string
	public readonly from: number
	public readonly to: number
	public readonly verification: Media
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, userId, institution, position, from, to,
		             verification, createdAt, updatedAt
	             }: WorkConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.institution = institution
		this.position = position
		this.from = from
		this.to = to
		this.verification = verification
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type WorkConstructorArgs = {
	id: string
	userId: string
	institution: string
	position: string
	from: number
	to: number
	verification: Media
	createdAt: number
	updatedAt: number
}