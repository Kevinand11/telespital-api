import { BaseMapper } from '@stranerd/api-commons'
import { SubjectFromModel, SubjectToModel } from '../models/subjects'
import { SubjectEntity } from '../../domain/entities/subjects'

export class SubjectMapper extends BaseMapper<SubjectFromModel, SubjectToModel, SubjectEntity> {
	mapFrom (model: SubjectFromModel | null) {
		if (!model) return null
		const {
			_id, title, createdAt, updatedAt
		} = model
		return new SubjectEntity({
			id: _id.toString(), title, createdAt, updatedAt
		})
	}

	mapTo (entity: SubjectEntity) {
		return {
			title: entity.title
		}
	}
}
