import { BaseMapper } from '@stranerd/api-commons'
import { AuthUserEntity } from '../../domain/entities/users'
import { UserFromModel, UserToModel } from '../models/users'

export class UserMapper extends BaseMapper<UserFromModel, UserToModel, AuthUserEntity> {
	mapFrom (param: UserFromModel | null) {
		return !param ? null : new AuthUserEntity({
			id: param._id.toString(),
			email: param.email,
			phone: param.phone,
			password: param.password,
			roles: param.roles,
			name: param.name,
			photo: param.photo,
			isVerified: param.isVerified,
			authTypes: param.authTypes,
			type: param.type,
			data: param.data,
			lastSignedInAt: param.lastSignedInAt,
			signedUpAt: param.signedUpAt
		})
	}

	mapTo (param: AuthUserEntity) {
		return {
			email: param.email,
			phone: param.phone,
			password: param.password,
			roles: param.roles,
			name: param.name,
			photo: param.photo,
			isVerified: param.isVerified,
			authTypes: param.authTypes,
			type: param.type,
			data: param.data,
			lastSignedInAt: param.lastSignedInAt,
			signedUpAt: param.signedUpAt
		}
	}
}