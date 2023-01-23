import { EmbeddedUser, UserBio, UserDates, UserMetaType, UserRatings, UserRoles, UserStatus } from '../types'
import { BaseEntity, Validation } from '@stranerd/api-commons'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly meta: UserMetaType
	public readonly status: UserStatus
	public readonly ratings: UserRatings

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

	getEmbedded (): EmbeddedUser {
		return {
			id: this.id,
			bio: this.bio,
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
	const first = Validation.capitalizeText(bio?.name?.first ?? 'Anon')
	const last = Validation.capitalizeText(bio?.name?.last ?? 'Ymous')
	const full = Validation.capitalizeText(bio?.name?.full ?? (first + ' ' + last))
	const email = bio?.email ?? 'anon@ymous.com'
	const type = bio?.type!
	const photo = bio?.photo ?? null
	const phone = bio?.phone!
	return {
		name: { first, last, full },
		email, type, photo, phone
	}
}

const generateDefaultRoles = (roles: Partial<UserRoles>): UserRoles => {
	return {
		isAdmin: roles?.isAdmin ?? false
	}
}

export const generateDefaultUser = (user: Partial<EmbeddedUser>): EmbeddedUser => {
	const id = user?.id ?? ''
	const bio = generateDefaultBio(user?.bio ?? {})
	const roles = generateDefaultRoles(user?.roles ?? {})
	return { id, bio, roles }
}