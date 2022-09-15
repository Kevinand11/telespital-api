import { EducationEntity } from '../entities/educations'
import { EducationToModel } from '../../data/models/educations'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface IEducationRepository {
	add: (data: EducationToModel) => Promise<EducationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<EducationEntity>>
	find: (id: string) => Promise<EducationEntity | null>
	update: (id: string, userId: string, data: Partial<EducationToModel>) => Promise<EducationEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
}