import { BaseMapper } from '@stranerd/api-commons'
import { ConsultationEntity } from '../../domain/entities/consultations'
import { ConsultationFromModel, ConsultationToModel } from '../models/consultations'

export class ConsultationMapper extends BaseMapper<ConsultationFromModel, ConsultationToModel, ConsultationEntity> {
	mapFrom (param: ConsultationFromModel | null) {
		return !param ? null : new ConsultationEntity({
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
			cancelled: param.cancelled,
			startedAt: param.startedAt,
			closedAt: param.closedAt,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: ConsultationEntity) {
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