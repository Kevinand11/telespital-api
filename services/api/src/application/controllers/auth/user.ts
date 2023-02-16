import { AuthUsersUseCases, AuthUserType } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { superAdminEmail } from '@utils/environment'
import { checkPermissions, deActivateUserProfile, signOutUser } from '@utils/modules/auth'
import { AuthRole, BadRequestError, Enum, NotFoundError, Request, Schema, validateReq, Validation, verifyAccessToken } from 'equipped'

export class UserController {
	static async findUser (req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async updateUser (req: Request) {
		const userId = req.authUser!.id
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null
		const data = validateReq({
			firstName: Schema.string().min(1),
			lastName: Schema.string().min(1),
			phone: Schema.any().addRule(Validation.isValidPhone()),
			photo: Schema.file().image().nullable()
		}, { ...req.body, photo: uploadedPhoto })
		const { firstName, lastName, phone } = data
		const photo = uploadedPhoto ? await StorageUseCases.upload('profiles', uploadedPhoto) : undefined

		return await AuthUsersUseCases.updateProfile({
			userId,
			data: {
				name: { first: firstName, last: lastName },
				phone,
				...(changedPhoto ? { photo } : {}) as any
			}
		})
	}

	static async updateUserRole (req: Request) {
		const unSupportedRoles = [AuthRole.isSuperAdmin, AuthRole.isInactive]
		const supportedRoles = Object.values(AuthRole)
			.filter((key) => !unSupportedRoles.includes(key))

		const { roles, userId, value } = validateReq({
			roles: Schema.array(Schema.any<Enum<typeof AuthRole>>().in(supportedRoles)),
			userId: Schema.string().min(1),
			value: Schema.boolean()
		}, req.body)

		if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')

		return await AuthUsersUseCases.updateRole({
			userId, roles: Object.fromEntries(
				roles.map((role) => [role, value])
			)
		})
	}

	static async updateUserInactiveRole (req: Request) {
		const { userId, value } = validateReq({
			userId: Schema.string().min(1),
			value: Schema.boolean()
		}, req.body)

		if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')
		const user = await AuthUsersUseCases.findUser(userId)
		if (!user) throw new NotFoundError()
		if (user.type === AuthUserType.patient) checkPermissions(req.authUser, [AuthRole.canDeactivatePatientProfile])
		if (user.type === AuthUserType.doctor) checkPermissions(req.authUser, [AuthRole.canDeactivateDoctorProfile])
		if (user.type === AuthUserType.admin) checkPermissions(req.authUser, [AuthRole.canDeactivateAdminProfile])

		return await deActivateUserProfile(userId, value,
			value ? 'Your account has been deactivated' : 'Your account has been reactivated')
	}

	static async signout (req: Request) {
		const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
		return await signOutUser(user?.id ?? '')
	}

	static async superAdmin (_: Request) {
		const user = await AuthUsersUseCases.findUserByEmail(superAdminEmail)
		if (!user) throw new NotFoundError()
		return await AuthUsersUseCases.updateRole({
			userId: user.id,
			roles: { [AuthRole.isSuperAdmin]: true }
		})
	}
}