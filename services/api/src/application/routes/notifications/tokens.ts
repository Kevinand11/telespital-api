import { isAuthenticated } from '@application/middlewares'
import { TokensUseCases } from '@modules/notifications'
import { makeController, Route, Schema, StatusCodes, validate } from 'equipped'

const subscribeDevice: Route = {
	path: '/notifications/devices/subscribe',
	method: 'post',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			const { token } = validate({
				token: Schema.string().min(1)
			}, req.body)
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
				token: Schema.string().min(1)
			}, req.body)
			const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: false })
			return {
				status: StatusCodes.Ok,
				result: !!res
			}
		})
	]
}

export const tokenRoutes: Route[] = [subscribeDevice, unsubscribeDevice]
