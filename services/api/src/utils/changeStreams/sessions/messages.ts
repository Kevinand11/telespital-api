import { MessageEntity, MessageFromModel } from '@modules/sessions'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'

export const MessageDbChangeCallbacks: DbChangeCallbacks<MessageFromModel, MessageEntity> = {
	created: async ({ after }) => {
		await Promise.all(after.members.map(async (userId) => {
			await appInstance.listener.created(`sessions/messages/${userId}`, after)
			await appInstance.listener.created(`sessions/messages/${after.id}/${userId}`, after)
		}))
	},
	updated: async ({ after, before, changes }) => {
		await Promise.all(after.members.map(async (userId) => {
			await appInstance.listener.updated(`sessions/messages/${userId}`, after)
			await appInstance.listener.updated(`sessions/messages/${after.id}/${userId}`, after)
		}))
		if (changes.media && before.media) await publishers.DELETEFILE.publish(before.media)
	},
	deleted: async ({ before }) => {
		await Promise.all(before.members.map(async (userId) => {
			await appInstance.listener.deleted(`sessions/messages/${userId}`, before)
			await appInstance.listener.deleted(`sessions/messages/${before.id}/${userId}`, before)
		}))
		if (before.media) await publishers.DELETEFILE.publish(before.media)
	}
}