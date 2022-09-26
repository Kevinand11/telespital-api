import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { PasswordsController } from '../../controllers/auth/passwords'
import { isAuthenticated } from '@application/middlewares'

const resetPasswordEmail: Route = {
	path: '/auth/passwords/reset/mail',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await PasswordsController.sendResetMail(req)
			}
		})
	]
}

const resetPassword: Route = {
	path: '/auth/passwords/reset',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await PasswordsController.resetPassword(req)
			}
		})
	]
}

const updatePassword: Route = {
	path: '/auth/passwords/update',
	method: 'post',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await PasswordsController.updatePassword(req)
			}
		})
	]
}

const routes: Route[] = [resetPasswordEmail, resetPassword, updatePassword]
export default routes