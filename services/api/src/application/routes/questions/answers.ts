import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { AnswerController } from '../../controllers/questions/answers'
import { isTutor } from '@application/middlewares'

export const answersRoutes: Route[] = [
	{
		path: '/questions/answers',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnswerController.GetAnswers(req)
				}
			})
		]
	},
	{
		path: '/questions/answers/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnswerController.FindAnswer(req)
				}
			})
		]
	},
	{
		path: '/questions/answers/:id',
		method: 'put',
		controllers: [
			requireAuthUser, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnswerController.UpdateAnswer(req)
				}
			})
		]
	},
	{
		path: '/questions/answers',
		method: 'post',
		controllers: [
			requireAuthUser, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnswerController.CreateAnswer(req)
				}
			})
		]
	},
	{
		path: '/questions/answers/:id',
		method: 'delete',
		controllers: [
			requireAuthUser, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnswerController.DeleteAnswer(req)
				}
			})
		]
	}
]