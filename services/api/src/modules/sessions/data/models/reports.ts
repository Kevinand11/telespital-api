import { ReportData, ReportStatus, ReportSettlement } from '../../domain/types'

export interface ReportFromModel extends ReportToModel {
	_id: string
	status: ReportStatus
	settlement: ReportSettlement
	createdAt: number
	updatedAt: number
}

export interface ReportToModel {
	userId: string
	data: ReportData
	message: string
}