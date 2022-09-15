import { BaseMapper } from '@stranerd/api-commons'
import { EducationEntity } from '../../domain/entities/educations'
import { EducationFromModel, EducationToModel } from '../models/educations'

export class EducationMapper extends BaseMapper<EducationFromModel, EducationToModel, EducationEntity> {
	mapFrom (param: EducationFromModel | null) {
		return !param ? null : new EducationEntity({
			id: param._id.toString(),
			userId: param.userId,
			school: param.school,
			degree: param.degree,
			from: param.from,
			to: param.to,
			verification: param.verification,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: EducationEntity) {
		return {
			userId: param.userId,
			school: param.school,
			degree: param.degree,
			from: param.from,
			to: param.to,
			verification: param.verification
		}
	}
}