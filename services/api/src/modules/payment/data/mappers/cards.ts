import { BaseMapper } from '@stranerd/api-commons'
import { CardEntity } from '../../domain/entities/cards'
import { CardFromModel, CardToModel } from '../models/cards'

export class CardMapper extends BaseMapper<CardFromModel, CardToModel, CardEntity> {
	mapFrom (param: CardFromModel | null) {
		return !param ? null : new CardEntity({
			id: param._id.toString(),
			last4Digits: param.last4Digits,
			issuer: param.issuer,
			country: param.country,
			type: param.type,
			token: param.token,
			expiredAt: param.expiredAt,
			expired: param.expired,
			primary: param.primary,
			userId: param.userId,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: CardEntity) {
		return {
			last4Digits: param.last4Digits,
			issuer: param.issuer,
			country: param.country,
			type: param.type,
			token: param.token,
			expiredAt: param.expiredAt,
			primary: param.primary,
			userId: param.userId
		}
	}
}