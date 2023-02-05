import { BaseMapper } from '@stranerd/api-commons'
import { PayoutEntity } from '../../domain/entities/payouts'
import { PayoutFromModel, PayoutToModel } from '../models/payouts'

export class PayoutMapper extends BaseMapper<PayoutFromModel, PayoutToModel, PayoutEntity> {
	mapFrom (param: PayoutFromModel | null) {
		return !param ? null : new PayoutEntity({
			id: param._id.toString(),
			userId: param.userId,
			pay: param.pay,
			status: param.status,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: PayoutEntity) {
		return {
			userId: param.userId
		}
	}
}