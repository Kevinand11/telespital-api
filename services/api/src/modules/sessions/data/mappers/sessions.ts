import { BaseMapper } from '@stranerd/api-commons'
import { SessionEntity } from '../../domain/entities/sessions'
import { SessionFromModel, SessionToModel } from '../models/sessions'

export class SessionMapper extends BaseMapper<SessionFromModel, SessionToModel, SessionEntity> {
	mapFrom (param: SessionFromModel | null) {
		return !param ? null : new SessionEntity({
			id: param._id.toString(),
			doctor: param.doctor,
			patient: param.patient,
			description: param.description,
			prescriptions: param.prescriptions,
			note: param.note,
			status: param.status,
			price: param.price,
			currency: param.currency,
			paid: param.paid,
			ratings: param.ratings,
			cancelled: param.cancelled,
			startedAt: param.startedAt,
			closedAt: param.closedAt,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: SessionEntity) {
		return {
			doctor: param.doctor,
			patient: param.patient,
			description: param.description,
			prescriptions: param.prescriptions,
			note: param.note,
			status: param.status,
			price: param.price,
			currency: param.currency,
			paid: param.paid
		}
	}
}