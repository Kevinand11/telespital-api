import { isAdmin } from '@application/middlewares'
import { AuthRole, makeController, Route, StatusCodes } from 'equipped'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes: Route[] = [
	{
		path: '/users/users/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getUsers(req)
				}
			})
		]
	},
	{
		path: '/users/users/admins',
		method: 'get',
		controllers: [
			isAdmin([AuthRole.canViewAdmins]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getAdmins(req)
				}
			})
		]
	},
	{
		path: '/users/users/doctors',
		method: 'get',
		controllers: [
			isAdmin([AuthRole.canViewDoctors]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getDoctors(req)
				}
			})
		]
	},
	{
		path: '/users/users/patients',
		method: 'get',
		controllers: [
			isAdmin([AuthRole.canViewPatients]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getPatients(req)
				}
			})
		]
	},
	{
		path: '/users/users/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.findUser(req)
				}
			})
		]
	}
]