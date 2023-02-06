import { Events, EventTypes } from '@stranerd/api-commons'
import { appInstance } from '@utils/environment'
import { sendMailAndCatchError } from '@utils/modules/notifications/emails'
import { StorageUseCases } from '@modules/storage'

const eventBus = appInstance.eventBus

export const subscribers = {
	[EventTypes.SENDMAIL]: eventBus.createSubscriber<Events['SENDMAIL']>(EventTypes.SENDMAIL, async (data) => {
		await sendMailAndCatchError(data)
	}),
	[EventTypes.DELETEFILE]: eventBus.createSubscriber<Events['DELETEFILE']>(EventTypes.DELETEFILE, async (data) => {
		if (data?.path) await StorageUseCases.delete(data.path)
	})
}

export const publishers = {
	[EventTypes.SENDMAIL]: eventBus.createPublisher<Events['SENDMAIL']>(EventTypes.SENDMAIL),
	[EventTypes.DELETEFILE]: eventBus.createPublisher<Events['DELETEFILE']>(EventTypes.DELETEFILE)
}