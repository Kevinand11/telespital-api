import { BaseMapper } from 'equipped'
import { ReportEntity } from '../../domain/entities/reports'
import { ReportFromModel, ReportToModel } from '../models/reports'

export class ReportMapper extends BaseMapper<ReportFromModel, ReportToModel, ReportEntity> {
	mapFrom (param: ReportFromModel | null) {
		return !param ? null : new ReportEntity({
			id: param._id.toString(),
			userId: param.userId,
			message: param.message,
			data: param.data,
			status: param.status,
			settlement: param.settlement,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: ReportEntity) {
		return {
			userId: param.userId,
			message: param.message,
			data: param.data
		}
	}
}