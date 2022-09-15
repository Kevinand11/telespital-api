import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { appId } from '@utils/environment'
import authRoutes from './auth'
import notificationRoutes from './notifications'
import questionRoutes from './questions'
import usersRoutes from './users'
import paymentRoutes from './payment'

export const routes: Route[] = [
	...authRoutes,
	...notificationRoutes,
	...questionRoutes,
	...usersRoutes,
	...paymentRoutes,
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async () => {
				return {
					status: StatusCodes.Ok,
					result: `${appId} service running`
				}
			})
		]
	}
]