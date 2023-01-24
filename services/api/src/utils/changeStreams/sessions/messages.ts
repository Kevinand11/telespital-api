import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { MessageEntity, MessageFromModel } from '@modules/sessions'
import { EventTypes, publishers } from '@utils/events'
import { getSocketEmitter } from '@index'

export const MessageChangeStreamCallbacks: ChangeStreamCallbacks<MessageFromModel, MessageEntity> = {
	created: async ({ after }) => {
		await Promise.all(after.members.map(async (userId) => {
			await getSocketEmitter().emitCreated(`sessions/messages/${userId}`, after)
			await getSocketEmitter().emitCreated(`sessions/messages/${after.id}/${userId}`, after)
		}))
	},
	updated: async ({ after, before, changes }) => {
		await Promise.all(after.members.map(async (userId) => {
			await getSocketEmitter().emitUpdated(`sessions/messages/${userId}`, after)
			await getSocketEmitter().emitUpdated(`sessions/messages/${after.id}/${userId}`, after)
		}))
		if (changes.media && before.media) await publishers[EventTypes.DELETEFILE].publish(before.media)
	},
	deleted: async ({ before }) => {
		await Promise.all(before.members.map(async (userId) => {
			await getSocketEmitter().emitDeleted(`sessions/messages/${userId}`, before)
			await getSocketEmitter().emitDeleted(`sessions/messages/${before.id}/${userId}`, before)
		}))
		if (before.media) await publishers[EventTypes.DELETEFILE].publish(before.media)
	}
}