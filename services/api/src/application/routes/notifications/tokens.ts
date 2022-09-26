import { makeController, Route, StatusCodes, validate, Validation } from '@stranerd/api-commons'
import { TokensUseCases } from '@modules/notifications'
import { isAuthenticated } from '@application/middlewares'

const subscribeDevice: Route = {
	path: '/notifications/devices/subscribe',
	method: 'post',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			const { token } = validate({
				token: req.body.token
			}, {
				token: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
			})
			const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: true })
			return {
				status: StatusCodes.Ok,
				result: !!res
			}
		})
	]
}

const unsubscribeDevice: Route = {
	path: '/notifications/devices/unsubscribe',
	method: 'post',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			const { token } = validate({
				token: req.body.token
			}, {
				token: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
			})
			const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: false })
			return {
				status: StatusCodes.Ok,
				result: !!res
			}
		})
	]
}

export const tokenRoutes: Route[] = [subscribeDevice, unsubscribeDevice]
