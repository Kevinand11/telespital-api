import { ReportToModel } from './../../data/models/reports'
import { QueryParams, QueryResults } from 'equipped'
import { ReportEntity } from '../entities/reports'

export interface IReportRepository {
	get: (query: QueryParams) => Promise<QueryResults<ReportEntity>>
	find: (id: string) => Promise<ReportEntity | null>
	create: (data: ReportToModel) => Promise<ReportEntity>
	settle: (id: string, userId: string) => Promise<ReportEntity | null>
}
