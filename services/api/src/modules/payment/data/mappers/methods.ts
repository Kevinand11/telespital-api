import { BaseMapper } from '@stranerd/api-commons'
import { MethodEntity } from '../../domain/entities/methods'
import { MethodFromModel, MethodToModel } from '../models/methods'

export class MethodMapper extends BaseMapper<MethodFromModel, MethodToModel, MethodEntity> {
	mapFrom (param: MethodFromModel | null) {
		return !param ? null : new MethodEntity({
			id: param._id.toString(),
			data: param.data,
			token: param.token,
			primary: param.primary,
			userId: param.userId,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: MethodEntity) {
		return {
			data: param.data,
			token: param.token,
			primary: param.primary,
			userId: param.userId
		}
	}
}