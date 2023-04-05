import { EmailsUseCases } from '@modules/notifications'
import { appInstance, emails, isDev } from '@utils/environment'
import { Email, EmailsList } from 'equipped'
import { createTransport } from 'nodemailer'

const sendMail = async (email: Email) => {
	const { to, subject, content, from = EmailsList.NO_REPLY } = email
	const { email: user, pass } = emails[from]

	const transporter = createTransport({
		host: 'smtpout.secureserver.net',
		secure: false,
		port: 587,
		auth: { user, pass },
	})
	await transporter.verify()

	const attachments = [] as { filename: string, path: string, cid: string }[]

	await transporter.sendMail({
		from: `Telespital ${from}`,
		html: content,
		to, subject, attachments
	})
}

export const sendMailAndCatchError = async (email: Email) => {
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