import { AuthUseCases, AuthUsersUseCases, AuthUserType } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { checkPermissions, generateAuthOutput, isValidPassword } from '@utils/modules/auth'
import { AuthRole, NotAuthorizedError, Request, Schema, validate, Validation, ValidationError } from 'equipped'

export class EmailsController {
	static async signup (req: Request) {
		const userCredential = {
			email: req.body.email ?? '',
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
			phone: req.body.phone,
			photo: req.files.photo?.[0] ?? null,
			type: req.body.type,
			primarySpecialty: req.body.primarySpecialty,
			secondarySpecialty: req.body.secondarySpecialty
		}

		const user = await AuthUsersUseCases.findUserByEmail(userCredential.email)

		const isDoctorType = userCredential.type === AuthUserType.doctor
		const isAdminType = userCredential.type === AuthUserType.admin

		if (isAdminType && !checkPermissions(req.authUser, [AuthRole.canCreateAdmins])) throw new NotAuthorizedError()

		const {
			email, firstName, lastName, phone,
			password, photo: userPhoto, type,
			primarySpecialty, secondarySpecialty
		} = validate({
			email: Schema.string().email().addRule((value) => {
				const email = value as string
				return !user ? Validation.isValid(email) : Validation.isInvalid(['email already in use'], email)
			}),
			password: Schema.string().addRule(isValidPassword),
			firstName: Schema.string().min(1),
			lastName: Schema.string().min(1),
			phone: Schema.any().addRule(Validation.isValidPhone()),
			photo: Schema.file().image().nullable(),
			type: Schema.any<AuthUserType>().in(Object.values(AuthUserType)),
			primarySpecialty: Schema.string().min(isDoctorType ? 1 : 0).default(''),
			secondarySpecialty: Schema.string().min(isDoctorType ? 1 : 0).default(''),
		}, userCredential)
		const photo = userPhoto ? await StorageUseCases.upload('profiles', userPhoto) : null
		const validateData = {
			name: { first: firstName, last: lastName },
			email, password, photo, type, phone,
			data: isDoctorType ? { primarySpecialty: primarySpecialty!, secondarySpecialty: secondarySpecialty! } : {}
		}

		const updatedUser = user
			? await AuthUsersUseCases.updateDetails({ userId: user.id, data: validateData })
			: await AuthUseCases.registerUser(validateData)

		return await generateAuthOutput(updatedUser)
	}

	static async signin (req: Request) {
		const validateData = validate({
			email: Schema.string().email(),
			password: Schema.string(),
		}, req.body)

		const data = await AuthUseCases.authenticateUser(validateData)
		return await generateAuthOutput(data)
	}

	static async sendVerificationMail (req: Request) {
		const { email } = validate({
			email: Schema.string().email()
		}, req.body)

		const user = await AuthUsersUseCases.findUserByEmail(email)
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		return await AuthUseCases.sendVerificationMail(user.email)
	}

	static async verifyEmail (req: Request) {
		const { token } = validate({
			token: Schema.force.string()
		}, req.body)

		const data = await AuthUseCases.verifyEmail(token)
		return await generateAuthOutput(data)
	}
}