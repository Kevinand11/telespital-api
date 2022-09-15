import { BaseMapper } from '@stranerd/api-commons'
import { WorkEntity } from '../../domain/entities/works'
import { WorkFromModel, WorkToModel } from '../models/works'

export class WorkMapper extends BaseMapper<WorkFromModel, WorkToModel, WorkEntity> {
	mapFrom (param: WorkFromModel | null) {
		return !param ? null : new WorkEntity({
			id: param._id.toString(),
			userId: param.userId,
			institution: param.institution,
			position: param.position,
			from: param.from,
			to: param.to,
			verification: param.verification,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: WorkEntity) {
		return {
			userId: param.userId,
			institution: param.institution,
			position: param.position,
			from: param.from,
			to: param.to,
			verification: param.verification
		}
	}
}