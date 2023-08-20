import { BaseEntity, Validation } from 'equipped'
import { EmbeddedUser, UserBio, UserDates, UserMetaType, UserRatings, UserRoles, UserStatus } from '../types'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly meta: UserMetaType
	public readonly status: UserStatus
	public readonly ratings: UserRatings

	ignoreInJSON = ['bio.email', 'bio.phone']

	constructor ({
		id, bio, roles, dates, meta, status, ratings
	}: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = generateDefaultBio(bio ?? {})
		this.roles = generateDefaultRoles(roles ?? {})
		this.dates = dates
		this.meta = meta
		this.status = status
		this.ratings = ratings
	}

	isDeleted () {
		return this.dates.deletedAt !== null
	}

	getEmbedded (): EmbeddedUser {
		return {
			id: this.id,
			bio: {
				name: this.bio.name,
				email: this.bio.email,
				photo: this.bio.photo
			},
			roles: this.roles
		}
	}
}

type UserConstructorArgs = {
	id: string
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	meta: UserMetaType
	status: UserStatus
	ratings: UserRatings
}

const generateDefaultBio = (bio: Partial<UserBio>): UserBio => {
	const first = Validation.capitalize(bio?.name?.first ?? 'Anon')
	const last = Validation.capitalize(bio?.name?.last ?? 'Ymous')
	const full = Validation.capitalize(bio?.name?.full ?? (first + ' ' + last))
	const email = bio?.email ?? 'anon@ymous.com'
	const type = bio?.type!
	const photo = bio?.photo ?? null
	const phone = bio?.phone!
	return {
		name: { first, last, full },
		email, type, photo, phone,
		data: bio?.data ?? {}
	}
}

const generateDefaultRoles = (roles: Partial<UserRoles>): UserRoles => {
	return roles ?? {}
}

export const generateDefaultUser = (user: Partial<EmbeddedUser>): EmbeddedUser => {
	const id = user?.id ?? ''
	const bio = generateDefaultBio(user?.bio ?? {})
	const roles = generateDefaultRoles(user?.roles ?? {})
	return {
		id,
		bio: { name: bio.name, email: bio.email, photo: bio.photo },
		roles
	}
}