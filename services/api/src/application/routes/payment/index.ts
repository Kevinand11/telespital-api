import { transactionsRoutes } from './transactions'
import { cardsRoutes } from './cards'
import { walletsRoutes } from './wallets'

export default [
	...transactionsRoutes,
	...cardsRoutes,
	...walletsRoutes
]