import { BaseMapper } from 'equipped'
import { WalletEntity } from '../../domain/entities/wallets'
import { WalletFromModel, WalletToModel } from '../models/wallets'

export class WalletMapper extends BaseMapper<WalletFromModel, WalletToModel, WalletEntity> {
	mapFrom (param: WalletFromModel | null) {
		return !param ? null : new WalletEntity({
			id: param._id.toString(),
			userId: param.userId,
			balance: param.balance,
			account: param.account,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: WalletEntity) {
		return {
			userId: param.userId
		}
	}
}