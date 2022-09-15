import emailRoutes from './emails'
import passwordRoutes from './passwords'
import userRoutes from './user'
import tokenRoutes from './token'
import identityRoutes from './identities'

export default [
	...emailRoutes,
	...passwordRoutes,
	...userRoutes,
	...tokenRoutes,
	...identityRoutes
]