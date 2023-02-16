import { AuthRoles, AuthTypes, Enum, MediaOutput } from 'equipped'
import { AuthUserData, AuthUserType, UserPhone } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
	roles: AuthRoles
	signedUpAt: number
	lastSignedInAt: number
}

export interface UserToModel {
	email: string
	phone: UserPhone
	password: string
	name: { first: string, last: string }
	photo: MediaOutput | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
	type: AuthUserType
	data: AuthUserData
}