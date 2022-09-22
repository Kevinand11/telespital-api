import { readEmailFromPug } from '@stranerd/api-commons'
import { EventTypes, publishers } from '@utils/events'
import { EmailsList } from '@utils/types'

type Message = {
	name: string
	organization: string
	email: string
	phone: { code: string, number: string }
	message: string
}

const makeEmailBody = (message: Message) => {
	return `<h2>${message.name}</h2>
<h3>${message.email}(${message.phone.code}${message.phone.number})</h3>
<h4>${message.organization}</h4>
<p style="margin-top=2rem">${message.message}</p>
`
}

export const sendNewMessageEmail = async (message: Message) => {
	const content = await readEmailFromPug('emails/newContactMessage.pug', {
		message: makeEmailBody(message)
	})
	await publishers[EventTypes.SENDMAIL].publish({
		from: EmailsList.NO_REPLY,
		to: EmailsList.SUPPORT,
		subject: 'New Contact Message',
		content, data: {}
	})
}