import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { PayoutEntity } from '../entities/payouts'
import { EmbeddedUser } from '../types'

export interface IPayoutRepository {
	get: (query: QueryParams) => Promise<QueryResults<PayoutEntity>>
	find: (id: string) => Promise<PayoutEntity | null>
	create: (userId: string, users: EmbeddedUser[]) => Promise<PayoutEntity>
}
