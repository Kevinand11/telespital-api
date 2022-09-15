import emailRoutes from './emails'
import passwordRoutes from './passwords'
import userRoutes from './user'
import tokenRoutes from './token'

export default [
	...emailRoutes,
	...passwordRoutes,
	...userRoutes,
	...tokenRoutes
]