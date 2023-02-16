import { BaseEntity } from 'equipped'

export class ErrorEntity extends BaseEntity {
	public readonly id: string
	public readonly error: string
	public readonly subject: string
	public readonly to: string
	public readonly content: string
	public readonly from: string
	public readonly data: {
		attachments?: Record<string, boolean>
	}
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor (data: ErrorConstructor) {
		super()
		this.id = data.id
		this.error = data.error
		this.subject = data.subject
		this.to = data.to
		this.content = data.content
		this.from = data.from
		this.data = data.data
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}
}

type ErrorConstructor = {
	id: string
	error: string,
	subject: string,
	to: string,
	content: string,
	from: string,
	data: {
		attachments?: Record<string, boolean>
	}
	createdAt: number
	updatedAt: number
}