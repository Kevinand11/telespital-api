import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { EducationController } from '../../controllers/users/educations'
import { isTutor } from '@application/middlewares'

export const educationsRoutes: Route[] = [
	{
		path: '/users/educations',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.GetEducations(req)
				}
			})
		]
	},
	{
		path: '/users/educations/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.FindEducation(req)
				}
			})
		]
	},
	{
		path: '/users/educations/:id',
		method: 'put',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.UpdateEducation(req)
				}
			})
		]
	},
	{
		path: '/users/educations',
		method: 'post',
		controllers: [
			requireAuthUser, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.CreateEducation(req)
				}
			})
		]
	},
	{
		path: '/users/educations/:id',
		method: 'delete',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.DeleteEducation(req)
				}
			})
		]
	}
]