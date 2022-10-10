import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { ConsultationsController } from '../../controllers/consultations/consultations'
import { isAuthenticated } from '@application/middlewares'

export const consultationsRoutes: Route[] = [
	{
		path: '/consultations/consultations/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.getConsultations(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.findConsultation(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.createConsultation(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/connect',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.connect(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/:id/pay',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.payForConsultation(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/:id/description',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.updateDescription(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/:id/prescriptions',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.updatePrescriptions(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/:id/note',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.updateNote(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/:id/close',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.closeConsultation(req)
				}
			})
		]
	},
	{
		path: '/consultations/consultations/:id/cancel',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ConsultationsController.cancelConsultation(req)
				}
			})
		]
	}
]