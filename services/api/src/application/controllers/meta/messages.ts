import { Request, validate, Validation } from '@stranerd/api-commons'
import { sendNewMessageEmail } from '@utils/modules/meta/messages'
import { isValidPhone } from '@utils/modules/auth'

export class MessageController {
	static async createMessage (req: Request) {
		const {
			name, organization, email, phone, message
		} = validate({
			name: req.body.name,
			organization: req.body.organization,
			email: req.body.email,
			phone: req.body.phone,
			message: req.body.message
		}, {
			name: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			organization: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			email: { required: true, rules: [Validation.isEmail] },
			phone: { required: true, rules: [isValidPhone] },
			message: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		await sendNewMessageEmail({ name, organization, email, phone, message })

		return true
	}
}