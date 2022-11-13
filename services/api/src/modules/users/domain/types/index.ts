import { MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types'
import { AuthUserType, UserPhone } from '@modules/auth'

export type Media = MediaOutput

export type UserBio = {
	type: AuthUserType
	email: string
	phone: UserPhone
	name: {
		first: string
		last: string
		full: string
	}
	photo: Media | null
}

export type { UserPhone }

export type UserRoles = AuthRoles

export type UserDates = {
	createdAt: number
	deletedAt: number | null
}

export type UserStatus = {
	connections: string[]
	lastUpdatedAt: number
}

export enum UserMeta {
	sessionsAttended = 'sessionsAttended',
	sessionsHosted = 'sessionsHosted'
}

export type UserRatings = {
	total: number
	count: number
	avg: number
}

export type UserMetaType = Record<UserMeta, number>

export type EmbeddedUser = {
	id: string
	bio: UserBio
	roles: UserRoles
}
