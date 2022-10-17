import { transactionsRoutes } from './transactions'
import { methodsRoutes } from './methods'
import { walletsRoutes } from './wallets'

export default [
	...transactionsRoutes,
	...methodsRoutes,
	...walletsRoutes
]