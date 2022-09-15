import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { WorkController } from '../../controllers/users/works'
import { isTutor } from '@application/middlewares'

export const worksRoutes: Route[] = [
	{
		path: '/users/works',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.GetWorks(req)
				}
			})
		]
	},
	{
		path: '/users/works/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.FindWork(req)
				}
			})
		]
	},
	{
		path: '/users/works/:id',
		method: 'put',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.UpdateWork(req)
				}
			})
		]
	},
	{
		path: '/users/works',
		method: 'post',
		controllers: [
			requireAuthUser, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.CreateWork(req)
				}
			})
		]
	},
	{
		path: '/users/works/:id',
		method: 'delete',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.DeleteWork(req)
				}
			})
		]
	}
]