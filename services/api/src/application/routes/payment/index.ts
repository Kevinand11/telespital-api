import { methodsRoutes } from './methods'
import { payoutsRoutes } from './payouts'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'

export default [
	...transactionsRoutes,
	...methodsRoutes,
	...walletsRoutes,
	...payoutsRoutes
]