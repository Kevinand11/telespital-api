import { Route } from 'equipped'
import authRoutes from './auth'
import notificationRoutes from './notifications'
import usersRoutes from './users'
import paymentRoutes from './payment'
import metaRoutes from './meta'
import sessionsRoutes from './sessions'

export const routes: Route[] = [
	...authRoutes,
	...notificationRoutes,
	...usersRoutes,
	...paymentRoutes,
	...metaRoutes,
	...sessionsRoutes
]