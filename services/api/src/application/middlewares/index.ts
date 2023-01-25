import { AuthRole } from '@utils/types'
import {
	BadRequestError,
	makeMiddleware,
	NotAuthenticatedError,
	NotAuthorizedError,
	requireAuthUser,
	requireRefreshUser
} from '@stranerd/api-commons'
import { AuthUserType } from '@modules/auth'

export const isAuthenticatedButIgnoreVerified = makeMiddleware(
	async (request) => {
		await requireAuthUser(request)
	}
)

export const isAuthenticated = makeMiddleware(
	async (request) => {
		await requireAuthUser(request)
		if (!request.authUser?.isEmailVerified) throw new NotAuthenticatedError('verify your account to proceed')
	}
)

export const hasRefreshToken = makeMiddleware(
	async (request) => {
		await requireRefreshUser(request)
	}
)

export const cannotModifyMyRole = makeMiddleware(
	async (request) => {
		const userIdToEdit = request.body.userId
		if (!request.authUser) throw new NotAuthenticatedError()
		if (request.authUser.id === userIdToEdit) throw new BadRequestError('You cannot modify your own roles')
	}
)

export const isAdmin = makeMiddleware(
	async (request) => {
		const isAdmin = request.authUser?.roles?.[AuthRole.isAdmin] || request.authUser?.roles?.['isSuperAdmin']
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isAdmin) throw new NotAuthorizedError()
	}
)

export const isDoctor = makeMiddleware(
	async (request) => {
		if (!request.authUser) throw new NotAuthenticatedError()
		if (request.authUser.type !== AuthUserType.doctor) throw new NotAuthorizedError()
		if (request.authUser.roles[AuthRole.isInactive]) throw new NotAuthenticatedError('your account is currently inactive')
	}
)

export const isPatient = makeMiddleware(
	async (request) => {
		if (!request.authUser) throw new NotAuthenticatedError()
		if (request.authUser.type !== AuthUserType.patient) throw new NotAuthorizedError()
		if (request.authUser.roles[AuthRole.isInactive]) throw new NotAuthenticatedError('your account is currently inactive')
	}
)