import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { EducationEntity, EducationFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'
import { EventTypes, publishers } from '@utils/events'

export const EducationChangeStreamCallbacks: ChangeStreamCallbacks<EducationFromModel, EducationEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('users/educations', after)
		await getSocketEmitter().emitCreated(`users/educations/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await getSocketEmitter().emitUpdated('users/educations', after)
		await getSocketEmitter().emitUpdated(`users/educations/${after.id}`, after)

		if (changes.verification) await publishers[EventTypes.DELETEFILE].publish(before.verification)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('users/educations', before)
		await getSocketEmitter().emitDeleted(`users/educations/${before.id}`, before)

		await publishers[EventTypes.DELETEFILE].publish(before.verification)
	}
}