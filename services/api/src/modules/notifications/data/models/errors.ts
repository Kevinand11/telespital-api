export interface ErrorFromModel extends ErrorToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ErrorToModel {
	error: string,
	subject: string,
	to: string,
	content: string,
	from: string,
	data: {
		attachments?: Record<string, boolean>
	}
}