import { AuthUseCases, AuthUsersUseCases } from '@modules/auth'
import { generateAuthOutput, isValidPassword } from '@utils/modules/auth'
import { BadRequestError, Hash, Request, validate, Validation, ValidationError } from '@stranerd/api-commons'

export class PasswordsController {
	static async sendResetMail (req: Request) {
		const { email } = validate({
			email: req.body.email
		}, {
			email: { required: true, rules: [Validation.isEmail] }
		})

		const user = await AuthUsersUseCases.findUserByEmail(email)
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		return await AuthUseCases.sendPasswordResetMail(user.email)
	}

	static async resetPassword (req: Request) {
		const validateData = validate({
			token: req.body.token,
			password: req.body.password
		}, {
			token: { required: true, rules: [Validation.isString] },
			password: { required: true, rules: [isValidPassword] }
		})

		const data = await AuthUseCases.resetPassword(validateData)
		return await generateAuthOutput(data)
	}

	static async updatePassword (req: Request) {
		const userId = req.authUser!.id
		const { oldPassword, password } = validate({
			oldPassword: req.body.oldPassword,
			password: req.body.password
		}, {
			oldPassword: { required: true, rules: [Validation.isString] },
			password: { required: true, rules: [isValidPassword] }
		})

		const user = await AuthUsersUseCases.findUser(userId)
		if (!user) throw new BadRequestError('No account with such id exists')

		const match = await Hash.compare(oldPassword, user.password)
		if (!match) throw new ValidationError([{ messages: ['old password does not match'], field: 'oldPassword' }])

		return await AuthUsersUseCases.updatePassword({ userId, password })
	}
}