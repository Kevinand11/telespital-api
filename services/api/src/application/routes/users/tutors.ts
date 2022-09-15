import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { TutorsController } from '../../controllers/users/tutors'
import { isTutor } from '@application/middlewares'

export const tutorsRoutes: Route[] = [
	{
		path: '/users/tutors/save',
		method: 'post',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TutorsController.saveTutors(req)
				}
			})
		]
	},
	{
		path: '/users/tutors/subjects',
		method: 'post',
		controllers: [
			requireAuthUser, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TutorsController.saveTutors(req)
				}
			})
		]
	}
]