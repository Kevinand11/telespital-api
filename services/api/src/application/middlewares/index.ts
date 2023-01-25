import { AuthRole } from '@utils/types'
import {
	makeMiddleware,
	NotAuthenticatedError,
	NotAuthorizedError,
	Request,
	requireAuthUser,
	requireRefreshUser
} from '@stranerd/api-commons'
import { AuthUserType } from '@modules/auth'
import { checkPermissions } from '@utils/modules/auth'

const isAuth = async (req: Request) => {
	await requireAuthUser(req)
	if (!req.authUser?.isEmailVerified) throw new NotAuthenticatedError('verify your account to proceed')
	if (req.authUser.roles[AuthRole.isInactive]) throw new NotAuthorizedError('your account is currently inactive')
}

export const isAuthenticatedButIgnoreVerified = makeMiddleware(
	async (request) => {
		await requireAuthUser(request)
	}
)

export const isAuthenticated = makeMiddleware(
	async (request) => {
		await isAuth(request)
	}
)

export const hasRefreshToken = makeMiddleware(
	async (request) => {
		await requireRefreshUser(request)
	}
)

export const isAdmin = (roles: AuthRole[]) => makeMiddleware(
	async (request) => {
		await isAuth(request)
		checkPermissions(request.authUser, roles)
	}
)

export const isDoctor = makeMiddleware(
	async (request) => {
		await isAuth(request)
		if (request.authUser!.type !== AuthUserType.doctor) throw new NotAuthorizedError('you need a doctor account to access this route')
	}
)

export const isPatient = makeMiddleware(
	async (request) => {
		await isAuth(request)
		if (request.authUser!.type !== AuthUserType.patient) throw new NotAuthorizedError('you need a patient account to access this route')
	}
)