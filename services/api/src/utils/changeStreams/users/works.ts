import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { WorkEntity, WorkFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'
import { EventTypes, publishers } from '@utils/events'

export const WorkChangeStreamCallbacks: ChangeStreamCallbacks<WorkFromModel, WorkEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('users/works', after)
		await getSocketEmitter().emitCreated(`users/works/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await getSocketEmitter().emitUpdated('users/works', after)
		await getSocketEmitter().emitUpdated(`users/works/${after.id}`, after)

		if (changes.verification) await publishers[EventTypes.DELETEFILE].publish(before.verification)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('users/works', before)
		await getSocketEmitter().emitDeleted(`users/works/${before.id}`, before)

		await publishers[EventTypes.DELETEFILE].publish(before.verification)
	}
}