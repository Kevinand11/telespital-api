import { UserBio, UserDates, UserMetaType, UserRatings, UserRoles, UserStatus } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	meta: UserMetaType
	status: UserStatus
	ratings: UserRatings
}
