import { MessageEntity, MessageFromModel } from '@modules/sessions'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'

export const MessageDbChangeCallbacks: DbChangeCallbacks<MessageFromModel, MessageEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(after.members.map((userId) => [
			`sessions/messages/${userId}`, `sessions/messages/${after.id}/${userId}`
		]).flat(), after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created(after.members.map((userId) => [
			`sessions/messages/${userId}`, `sessions/messages/${after.id}/${userId}`
		]).flat(), after)
		if (changes.media && before.media) await publishers.DELETEFILE.publish(before.media)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(before.members.map((userId) => [
			`sessions/messages/${userId}`, `sessions/messages/${before.id}/${userId}`
		]).flat(), before)
		if (before.media) await publishers.DELETEFILE.publish(before.media)
	}
}