import { BaseEntity } from '@stranerd/api-commons'
import { ReportData, ReportStatus, ReportSettlement } from '../types'

export class ReportEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly message: string
	public readonly data: ReportData
	public readonly status: ReportStatus
	public readonly settlement: ReportSettlement
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, userId, message, data, status, settlement, createdAt, updatedAt
	             }: ReportConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.message = message
		this.data = data
		this.status = status
		this.settlement = settlement
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ReportConstructorArgs = {
	id: string
	userId: string
	message: string
	data: ReportData
	status: ReportStatus
	settlement: ReportSettlement
	createdAt: number
	updatedAt: number
}