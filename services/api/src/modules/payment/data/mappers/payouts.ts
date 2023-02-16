import { BaseMapper } from 'equipped'
import { PayoutEntity } from '../../domain/entities/payouts'
import { PayoutFromModel, PayoutToModel } from '../models/payouts'

export class PayoutMapper extends BaseMapper<PayoutFromModel, PayoutToModel, PayoutEntity> {
	mapFrom (param: PayoutFromModel | null) {
		return !param ? null : new PayoutEntity({
			id: param._id.toString(),
			userId: param.userId,
			pay: param.pay,
			status: param.status,
			settlement: param.settlement,
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