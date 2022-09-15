import { ChangeStreamCallbacks, readEmailFromPug } from '@stranerd/api-commons'
import { NotificationEntity, NotificationFromModel } from '@modules/notifications'
import { getSocketEmitter } from '@index'
import { sendPushNotification } from '@utils/modules/notifications/push'
import { EventTypes, publishers } from '@utils/events'
import { EmailsList } from '@utils/types'
import { UsersUseCases } from '@modules/users'

export const NotificationChangeStreamCallbacks: ChangeStreamCallbacks<NotificationFromModel, NotificationEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`notifications/notifications/${after.userId}`, after)
		await getSocketEmitter().emitCreated(`notifications/notifications/${after.id}/${after.userId}`, after)

		await sendPushNotification({
			userIds: [after.userId],
			title: after.title, body: after.body,
			data: {
				type: 'notifications',
				data: { id: after.id, data: after.data }
			}
		})

		if (after.sendEmail) {
			const user = await UsersUseCases.find(after.userId)
			if (user) {
				const content = await readEmailFromPug('emails/newNotification.pug', { notification: after })
				await publishers[EventTypes.SENDMAIL].publish({
					from: EmailsList.NO_REPLY, to: user.bio.email, subject: after.title,
					content, data: {}
				})
			}
		}
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated(`notifications/notifications/${after.userId}`, after)
		await getSocketEmitter().emitUpdated(`notifications/notifications/${after.id}/${after.userId}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`notifications/notifications/${before.userId}`, before)
		await getSocketEmitter().emitDeleted(`notifications/notifications/${before.id}/${before.userId}`, before)
	}
}