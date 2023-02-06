import { AuthUsersUseCases, AuthUserType } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { AuthRole, BadRequestError, NotFoundError, Request, validate, Validation, verifyAccessToken } from '@stranerd/api-commons'
import { superAdminEmail } from '@utils/environment'
import { checkPermissions, deActivateUserProfile, isValidPhone, signOutUser } from '@utils/modules/auth'

export class UserController {
	static async findUser (req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async updateUser (req: Request) {
		const userId = req.authUser!.id
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null
		const data = validate({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phone,
			photo: uploadedPhoto as any
		}, {
			firstName: { required: true, rules: [Validation.isString, Validation.isLongerThanOrEqualToX(2)] },
			lastName: { required: true, rules: [Validation.isString, Validation.isLongerThanOrEqualToX(2)] },
			phone: { required: true, rules: [isValidPhone] },
			photo: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})
		const { firstName, lastName, phone } = data
		if (uploadedPhoto) data.photo = await StorageUseCases.upload('profiles', uploadedPhoto)

		const validateData = {
			name: { first: firstName, last: lastName }, phone,
			...(changedPhoto ? { photo: data.photo } : {})
		}

		return await AuthUsersUseCases.updateProfile({ userId, data: validateData as any })
	}

	static async updateUserRole (req: Request) {
		const unSupportedRoles = [AuthRole.isSuperAdmin, AuthRole.isInactive]
		const supportedRoles = Object.values(AuthRole)
			.filter((key) => !unSupportedRoles.includes(key))

		const { roles, userId, value } = validate({
			roles: req.body.roles,
			userId: req.body.userId,
			value: req.body.value
		}, {
			roles: {
				required: true,
				rules: [Validation.isArray, Validation.isArrayOfX<string>((cur) => supportedRoles.includes(cur), 'roles')]
			},
			value: { required: true, rules: [Validation.isBoolean] },
			userId: { required: true, rules: [Validation.isString] }
		})

		if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')

		return await AuthUsersUseCases.updateRole({
			userId, roles: Object.fromEntries(
				roles.map((role) => [role, value])
			)
		})
	}

	static async updateUserInactiveRole (req: Request) {
		const { userId, value } = validate({
			userId: req.body.userId,
			value: req.body.value
		}, {
			value: { required: true, rules: [Validation.isBoolean] },
			userId: { required: true, rules: [Validation.isString] }
		})

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