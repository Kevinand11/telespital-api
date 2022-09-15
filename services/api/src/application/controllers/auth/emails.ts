import { AuthUseCases, AuthUsersUseCases } from '@modules/auth'
import { AuthTypes, Request, validate, Validation, ValidationError } from '@stranerd/api-commons'
import { generateAuthOutput } from '@utils/modules/auth'
import { StorageUseCases } from '@modules/storage'

export class EmailsController {
	static async signup (req: Request) {
		const userCredential = {
			email: req.body.email ?? '',
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
			photo: req.files.photo?.[0] ?? null
		}

		const user = await AuthUsersUseCases.findUserByEmail(userCredential.email)

		const isUniqueInDb = (_: string) => {
			if (!user) return Validation.isValid()
			if (user.authTypes.includes(AuthTypes.email)) return Validation.isInvalid('this email already exists with a password attached')
			if (user.authTypes.includes(AuthTypes.google)) return Validation.isInvalid('this email is associated with a google account. Try signing in with google')
			return Validation.isInvalid('email already in use')
		}

		const {
			email,
			firstName,
			lastName,
			password,
			photo: userPhoto
		} = validate(userCredential, {
			email: { required: true, rules: [Validation.isEmail, isUniqueInDb] },
			password: {
				required: true,
				rules: [Validation.isString, Validation.isLongerThanX(7), Validation.isShorterThanX(17)]
			},
			photo: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] },
			firstName: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			lastName: { required: true, rules: [Validation.isString] }
		})
		const photo = userPhoto ? await StorageUseCases.upload('profiles', userPhoto) : null
		const validateData = {
			name: { first: firstName, last: lastName },
			email, password, photo
		}

		const updatedUser = user
			? await AuthUsersUseCases.updateDetails({ userId: user.id, data: validateData })
			: await AuthUseCases.registerUser(validateData)

		return await generateAuthOutput(updatedUser)
	}

	static async signin (req: Request) {
		const validateData = validate({
			email: req.body.email,
			password: req.body.password
		}, {
			email: { required: true, rules: [Validation.isEmail] },
			password: { required: true, rules: [Validation.isString] }
		})

		const data = await AuthUseCases.authenticateUser(validateData)
		return await generateAuthOutput(data)
	}

	static async sendVerificationMail (req: Request) {
		const { email } = validate({
			email: req.body.email
		}, {
			email: { required: true, rules: [Validation.isEmail] }
		})

		const user = await AuthUsersUseCases.findUserByEmail(email)
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		return await AuthUseCases.sendVerificationMail(user.email)
	}

	static async verifyEmail (req: Request) {
		const { token } = validate({
			token: req.body.token
		}, {
			token: { required: true, rules: [Validation.isString] }
		})

		const data = await AuthUseCases.verifyEmail(token)
		return await generateAuthOutput(data)
	}
}