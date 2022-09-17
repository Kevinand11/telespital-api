import { AuthTypes, MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types'
import { AuthUserData, AuthUserType } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
	roles: AuthRoles
	signedUpAt: number
	lastSignedInAt: number
}

export interface UserToModel {
	email: string
	phone: { code: string, number: string }
	password: string
	name: { first: string, last: string }
	photo: MediaOutput | null
	isVerified: boolean
	authTypes: AuthTypes[]
	type: AuthUserType
	data: AuthUserData
}