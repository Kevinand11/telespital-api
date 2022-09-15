import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { SubjectController } from '../../controllers/questions/subjects'
import { isAdmin } from '@application/middlewares'

export const subjectsRoutes: Route[] = [
	{
		path: '/questions/subjects',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SubjectController.GetSubjects(req)
				}
			})
		]
	},
	{
		path: '/questions/subjects/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SubjectController.FindSubject(req)
				}
			})
		]
	},
	{
		path: '/questions/subjects/:id',
		method: 'put',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SubjectController.UpdateSubject(req)
				}
			})
		]
	},
	{
		path: '/questions/subjects',
		method: 'post',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SubjectController.CreateSubject(req)
				}
			})
		]
	},
	{
		path: '/questions/subjects/:id',
		method: 'delete',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SubjectController.DeleteSubject(req)
				}
			})
		]
	}
]