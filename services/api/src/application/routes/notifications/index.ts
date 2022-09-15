import { notificationsRoutes } from './notifications'
import { tokenRoutes } from './tokens'

export default [
	...notificationsRoutes,
	...tokenRoutes
]