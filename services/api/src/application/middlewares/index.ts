import { SupportedAuthRoles } from '@utils/types'
import { BadRequestError, makeMiddleware, NotAuthenticatedError, NotAuthorizedError } from '@stranerd/api-commons'

export const cannotModifyMyRole = makeMiddleware(
	async (request) => {
		const userIdToEdit = request.body.userId
		if (!request.authUser) throw new NotAuthenticatedError()
		if (request.authUser.id === userIdToEdit) throw new BadRequestError('You cannot modify your own roles')
	}
)

export const isAdmin = makeMiddleware(
	async (request) => {
		const isAdmin = request.authUser?.roles?.[SupportedAuthRoles.isAdmin] || request.authUser?.roles?.['isSuperAdmin']
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isAdmin) throw new NotAuthorizedError()
	}
)

export const isTutor = makeMiddleware(
	async (request) => {
		const isTutor = request.authUser?.roles?.[SupportedAuthRoles.isTutor]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isTutor) throw new NotAuthorizedError()
	}
)