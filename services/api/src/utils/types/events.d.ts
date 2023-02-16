import { Email, EventTypes, MediaOutput } from 'equipped'

declare module 'equipped/lib/events/events' {
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