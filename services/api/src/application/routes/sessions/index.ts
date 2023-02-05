import { sessionsRoutes } from './sessions'
import { reviewsRoutes } from './reviews'
import { messageRoutes } from './messages'
import { reportsRoutes } from './reports'

export default [
	...sessionsRoutes,
	...reviewsRoutes,
	...messageRoutes,
	...reportsRoutes
]