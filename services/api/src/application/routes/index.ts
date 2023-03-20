import { Route } from 'equipped'
import authRoutes from './auth'
import metaRoutes from './meta'
import paymentRoutes from './payment'
import usersRoutes from './users'

export const routes: Route[] = [
	...authRoutes,
	...usersRoutes,
	...paymentRoutes,
	...metaRoutes
]