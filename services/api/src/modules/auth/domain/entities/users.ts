import { AuthTypes, BaseEntity, MediaOutput } from '@stranerd/api-commons'
import { AuthUserData, AuthUserType, UserPhone, UserUpdateInput } from '../types'
import { AuthRoles } from '@utils/types'

export class AuthUserEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly phone: UserPhone
	public readonly password: string
	public readonly name: { first: string, last: string }
	public readonly photo: MediaOutput | null
	public readonly isVerified: boolean
	public readonly authTypes: AuthTypes[]
	public readonly roles: AuthRoles
	public readonly type: AuthUserType
	public readonly data: AuthUserData
	public readonly lastSignedInAt: number
	public readonly signedUpAt: number

	constructor (data: UserConstructorArgs) {
		super()
		this.id = data.id
		this.email = data.email
		this.phone = data.phone
		this.password = data.password
		this.name = data.name
		this.photo = data.photo
		this.isVerified = data.isVerified
		this.authTypes = data.authTypes
		this.roles = data.roles ?? {}
		this.type = data.type
		this.data = data.data
		this.lastSignedInAt = data.lastSignedInAt
		this.signedUpAt = data.signedUpAt
	}

	get allNames () {
		return {
			...this.name,
			full: [this.name.first, this.name.last].join(' ').replaceAll('  ', ' ')
		}
	}

	static bioKeys (): (keyof (UserUpdateInput & { email: string }))[] {
		return ['name', 'email', 'photo']
	}
}

interface UserConstructorArgs {
	id: string
	email: string
	phone: UserPhone
	password: string
	roles: AuthRoles
	name: { first: string, last: string }
	photo: MediaOutput | null
	isVerified: boolean
	authTypes: AuthTypes[]
	type: AuthUserType
	data: AuthUserData
	lastSignedInAt: number
	signedUpAt: number
}