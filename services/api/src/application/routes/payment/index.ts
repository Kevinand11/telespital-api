import { methodsRoutes } from './methods'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'

export default [
	...transactionsRoutes,
	...methodsRoutes,
	...walletsRoutes
]