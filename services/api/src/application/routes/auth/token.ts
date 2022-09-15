import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { TokenController } from '../../controllers/auth/token'

const getNewTokens: Route = {
	path: '/auth/token',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await TokenController.getNewTokens(req)
			}
		})
	]
}

const routes: Route[] = [getNewTokens]
export default routes