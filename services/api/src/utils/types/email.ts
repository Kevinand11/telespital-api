import { Email } from '@stranerd/api-commons'

export enum EmailsList {
	NO_REPLY = 'no-reply@stranerd.com'
}

export type TypedEmail = Email<EmailsList, {}>