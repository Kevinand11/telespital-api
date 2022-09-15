import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { SubjectToModel } from '../../data/models/subjects'
import { SubjectEntity } from '../entities/subjects'

export interface ISubjectRepository {
	add: (data: SubjectToModel) => Promise<SubjectEntity>
	get: (query: QueryParams) => Promise<QueryResults<SubjectEntity>>
	find: (id: string) => Promise<SubjectEntity | null>
	update: (id: string, data: Partial<SubjectToModel>) => Promise<SubjectEntity | null>
	delete: (id: string) => Promise<boolean>
}
