import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { UserController } from '../../controllers/auth/user'
import { cannotModifyMyRole, isAdmin, isAuthenticated } from '../../middlewares'

const getUserDetails: Route = {
	path: '/auth/user',
	method: 'get',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.findUser(req)
			}
		})
	]
}

const updateUser: Route = {
	path: '/auth/user',
	method: 'put',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.updateUser(req)
			}
		})
	]
}

const updateUserRole: Route = {
	path: '/auth/user/roles',
	method: 'post',
	controllers: [
		isAuthenticated, isAdmin, cannotModifyMyRole,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.updateUserRole(req)
			}
		})
	]
}

const signout: Route = {
	path: '/auth/user/signout',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.signout(req)
			}
		})
	]
}

const superAdmin: Route = {
	path: '/auth/user/superAdmin',
	method: 'get',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.superAdmin(req)
			}
		})
	]
}

const routes: Route[] = [getUserDetails, updateUserRole, updateUser, signout, superAdmin]
export default routes