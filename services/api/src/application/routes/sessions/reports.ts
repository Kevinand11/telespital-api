import { ReportsController } from '@application/controllers/sessions/reports'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { AuthRole, makeController, Route, StatusCodes } from 'equipped'

export const reportsRoutes: Route[] = [
	{
		path: '/sessions/reports',
		method: 'get',
		controllers: [
			isAdmin([AuthRole.canViewReports]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReportsController.get(req)
				}
			})
		]
	},
	{
		path: '/sessions/reports/:id',
		method: 'get',
		controllers: [
			isAdmin([AuthRole.canViewReports]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReportsController.find(req)
				}
			})
		]
	},
	{
		path: '/sessions/reports/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReportsController.create(req)
				}
			})
		]
	},
	{
		path: '/sessions/reports/:id/settle',
		method: 'post',
		controllers: [
			isAdmin([AuthRole.canViewReports]),
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReportsController.settle(req)
				}
			})
		]
	}
]