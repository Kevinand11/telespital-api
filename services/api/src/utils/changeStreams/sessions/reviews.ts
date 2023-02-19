import { ReviewEntity, ReviewFromModel } from '@modules/sessions'
import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const ReviewDbChangeCallbacks: DbChangeCallbacks<ReviewFromModel, ReviewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('sessions/reviews', after)
		await appInstance.listener.created(`sessions/reviews/${after.id}`, after)
		await UsersUseCases.updateRatings({ userId: after.to, ratings: after.rating, add: true })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated('sessions/reviews', after)
		await appInstance.listener.updated(`sessions/reviews/${after.id}`, after)
		if (changes.rating || changes.to) {
			await UsersUseCases.updateRatings({ userId: before.to, ratings: before.rating, add: false })
			await UsersUseCases.updateRatings({ userId: after.to, ratings: after.rating, add: true })
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('sessions/reviews', before)
		await appInstance.listener.deleted(`sessions/reviews/${before.id}`, before)
		await UsersUseCases.updateRatings({ userId: before.to, ratings: before.rating, add: false })
	}
}