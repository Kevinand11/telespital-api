import { AuthUseCases, AuthUsersUseCases } from '@modules/auth'
import { generateAuthOutput, isValidPassword } from '@utils/modules/auth'
import { BadRequestError, Hash, Request, Schema, validateReq, ValidationError } from 'equipped'

export class PasswordsController {
	static async sendResetMail (req: Request) {
		const { email } = validateReq({
			email: Schema.string().email()
		}, req.body)

		const user = await AuthUsersUseCases.findUserByEmail(email)
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		return await AuthUseCases.sendPasswordResetMail(user.email)
	}

	static async resetPassword (req: Request) {
		const validateData = validateReq({
			token: Schema.string(),
			password: Schema.string().min(8).max(16)
		}, req.body)

		const data = await AuthUseCases.resetPassword(validateData)
		return await generateAuthOutput(data)
	}

	static async updatePassword (req: Request) {
		const userId = req.authUser!.id
		const { oldPassword, password } = validateReq({
			oldPassword: Schema.string(),
			password: Schema.string().addRule(isValidPassword)
		}, req.body)

		const user = await AuthUsersUseCases.findUser(userId)
		if (!user) throw new BadRequestError('No account with such id exists')

		const match = await Hash.compare(oldPassword, user.password)
		if (!match) throw new ValidationError([{ messages: ['old password does not match'], field: 'oldPassword' }])

		return await AuthUsersUseCases.updatePassword({ userId, password })
	}
}