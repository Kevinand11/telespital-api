import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { IdentitiesController } from '../../controllers/auth/identities'

const googleSignIn: Route = {
	path: '/auth/identities/google',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await IdentitiesController.googleSignIn(req)
			}
		})
	]
}

const routes: Route[] = [googleSignIn]
export default routes