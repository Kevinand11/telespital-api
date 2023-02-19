import { ReviewsUseCases, SessionsUseCases } from '@modules/sessions'
import { UserEntity, UserFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { deActivateUserProfile } from '@utils/modules/auth'
import { DbChangeCallbacks } from 'equipped'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('users/users', after)
		await appInstance.listener.created(`users/users/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated('users/users', after)
		await appInstance.listener.updated(`users/users/${after.id}`, after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			SessionsUseCases, ReviewsUseCases
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))

		const MINIMUM_RATING = 3
		const isLoweredRating = before.ratings.avg >= MINIMUM_RATING && after.ratings.avg < MINIMUM_RATING
		if (isLoweredRating) await deActivateUserProfile(after.id, true,
			`Your account has been deactivated because it went below a rating of ${MINIMUM_RATING}`)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/users', before)
		await appInstance.listener.deleted(`users/users/${before.id}`, before)
	}
}
