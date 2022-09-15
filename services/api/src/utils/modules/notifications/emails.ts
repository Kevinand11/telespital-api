import { createTransport } from 'nodemailer'
import { appInstance, emails, isDev } from '@utils/environment'
import { EmailsUseCases } from '@modules/notifications'
import { EmailsList, TypedEmail } from '@utils/types'

const sendMail = async (email: TypedEmail) => {
	const { to, subject, content, from = EmailsList.NO_REPLY } = email
	const { clientId, privateKey } = emails[from]

	const transporter = createTransport({
		service: 'gmail',
		auth: { type: 'OAuth2', user: from, serviceClient: clientId, privateKey },
		tls: { rejectUnauthorized: false }
	})
	await transporter.verify()

	const attachments = [] as { filename: string, path: string, cid: string }[]

	await transporter.sendMail({
		from: `Telespital ${from}`,
		html: content,
		to, subject, attachments
	})
}

export const sendMailAndCatchError = async (email: TypedEmail) => {
	try {
		if (isDev) await appInstance.logger.info(email.to, email.content)
		await sendMail(email)
	} catch (e) {
		await EmailsUseCases.addError({
			...email,
			error: (e as Error).message
		})
	}
}