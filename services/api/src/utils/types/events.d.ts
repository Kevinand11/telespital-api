import { Email, EventTypes, MediaOutput } from '@stranerd/api-commons'

declare module '@stranerd/api-commons/lib/events/events' {
    interface Events {
        [EventTypes.SENDMAIL]: {
            topic: typeof EventTypes.SENDMAIL,
            data: Email
        },
        [EventTypes.DELETEFILE]: {
            topic: typeof EventTypes.DELETEFILE,
            data: MediaOutput
        }
    }
}