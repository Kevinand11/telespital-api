import { ConsultationEntity } from '../entities/consultations'
import { ConsultationToModel } from '../../data/models/consultations'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { EmbeddedUser } from '../types'

export interface IConsultationRepository {
	add: (data: ConsultationToModel) => Promise<ConsultationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ConsultationEntity>>
	find: (id: string) => Promise<ConsultationEntity | null>
	connect: (user: EmbeddedUser) => Promise<ConsultationEntity | null>
	update: (id: string, userId: string, data: Partial<ConsultationToModel>, byDoctor: boolean) => Promise<ConsultationEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	updatePaid: (id: string, add: boolean) => Promise<boolean>
	close: (id: string, userId: string) => Promise<boolean>
	cancel: (id: string, userId: string, reason: string) => Promise<boolean>
}