import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { ReviewEntity, ReviewFromModel } from '@modules/consultations'
import { getSocketEmitter } from '@index'
import { UsersUseCases } from '@modules/users'

export const ReviewChangeStreamCallbacks: ChangeStreamCallbacks<ReviewFromModel, ReviewEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('consultations/reviews', after)
		await getSocketEmitter().emitCreated(`consultations/reviews/${after.id}`, after)
		await UsersUseCases.updateRatings({ userId: after.to, ratings: after.rating, add: true })
	},
	updated: async ({ after, before, changes }) => {
		await getSocketEmitter().emitUpdated('consultations/reviews', after)
		await getSocketEmitter().emitUpdated(`consultations/reviews/${after.id}`, after)
		if (changes.rating || changes.to) {
			await UsersUseCases.updateRatings({ userId: before.to, ratings: before.rating, add: false })
			await UsersUseCases.updateRatings({ userId: after.to, ratings: after.rating, add: true })
		}
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('consultations/reviews', before)
		await getSocketEmitter().emitDeleted(`consultations/reviews/${before.id}`, before)
		await UsersUseCases.updateRatings({ userId: before.to, ratings: before.rating, add: false })
	}
}