import { sendNewMessageEmail } from '@utils/modules/meta/messages'
import { Request, Schema, validate, Validation } from 'equipped'

export class MessageController {
	static async createMessage (req: Request) {
		const {
			name, organization, email, phone, message
		} = validate({
			name: Schema.string().min(1),
			organization: Schema.string().min(1),
			email: Schema.string().email(),
			phone: Schema.any().addRule(Validation.isValidPhone()),
			message: Schema.string().min(1)
		}, req.body)

		await sendNewMessageEmail({ name, organization, email, phone, message })

		return true
	}
}