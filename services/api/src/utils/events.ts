import { MediaOutput } from '@stranerd/api-commons'
import { TypedEmail } from '@utils/types'
import { appInstance } from '@utils/environment'
import { sendMailAndCatchError } from '@utils/modules/notifications/emails'
import { StorageUseCases } from '@modules/storage'

export enum EventTypes {
	SENDMAIL = 'SENDMAIL',
	DELETEFILE = 'DELETEFILE'
}

interface Event<Data> {
	topic: keyof typeof EventTypes;
	data: Data;
}

export interface Events extends Record<EventTypes, Event<any>> {
	SENDMAIL: {
		topic: typeof EventTypes.SENDMAIL,
		data: TypedEmail
	},
	DELETEFILE: {
		topic: typeof EventTypes.DELETEFILE,
		data: MediaOutput
	}
}

const eventBus = appInstance.eventBus

export const subscribers = {
	[EventTypes.SENDMAIL]: eventBus.createSubscriber<Events[EventTypes.SENDMAIL]>(EventTypes.SENDMAIL, async (data) => {
		await sendMailAndCatchError(data)
	}),
	[EventTypes.DELETEFILE]: eventBus.createSubscriber<Events[EventTypes.DELETEFILE]>(EventTypes.DELETEFILE, async (data) => {
		if (data?.path) await StorageUseCases.delete(data.path)
	})
}

export const publishers = {
	[EventTypes.SENDMAIL]: eventBus.createPublisher<Events[EventTypes.SENDMAIL]>(EventTypes.SENDMAIL),
	[EventTypes.DELETEFILE]: eventBus.createPublisher<Events[EventTypes.DELETEFILE]>(EventTypes.DELETEFILE)
}