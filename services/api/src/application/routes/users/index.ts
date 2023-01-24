import { usersRoutes } from './users'
import { ordersRoutes } from './orders'

export default [
	...usersRoutes,
	...ordersRoutes
]