import { Email } from '@stranerd/api-commons'

export enum EmailsList {
	NO_REPLY = 'no-reply@telespital.com', // TODO: get correct email address from Michael
	SUPPORT = 'support@telespital.com'
}

export type TypedEmail = Email<EmailsList, {}>