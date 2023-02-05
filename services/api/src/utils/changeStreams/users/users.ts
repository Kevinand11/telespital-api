import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { UserEntity, UserFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'
import { ReviewsUseCases, SessionsUseCases } from '@modules/sessions'
import { deActivateUserProfile } from '@utils/modules/auth'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('users/users', after)
		await getSocketEmitter().emitCreated(`users/users/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await getSocketEmitter().emitUpdated('users/users', after)
		await getSocketEmitter().emitUpdated(`users/users/${after.id}`, after)
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
		await getSocketEmitter().emitDeleted('users/users', before)
		await getSocketEmitter().emitDeleted(`users/users/${before.id}`, before)
	}
}
