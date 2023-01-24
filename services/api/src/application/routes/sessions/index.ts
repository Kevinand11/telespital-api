import { sessionsRoutes } from './sessions'
import { reviewsRoutes } from './reviews'
import { messageRoutes } from './messages'

export default [
	...sessionsRoutes,
	...reviewsRoutes,
	...messageRoutes
]