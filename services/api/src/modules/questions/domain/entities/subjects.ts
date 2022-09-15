import { BaseEntity } from '@stranerd/api-commons'

export class SubjectEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, title, createdAt, updatedAt
	             }: SubjectConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type SubjectConstructorArgs = {
	id: string
	title: string
	createdAt: number
	updatedAt: number
}
