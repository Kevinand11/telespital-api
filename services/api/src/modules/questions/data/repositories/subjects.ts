import { ISubjectRepository } from '../../domain/irepositories/subjects'
import { SubjectMapper } from '../mappers/subjects'
import { SubjectFromModel, SubjectToModel } from '../models/subjects'
import { Subject } from '../mongooseModels/subjects'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'

export class SubjectRepository implements ISubjectRepository {
	private static instance: SubjectRepository
	private mapper: SubjectMapper

	private constructor () {
		this.mapper = new SubjectMapper()
	}

	static getInstance () {
		if (!SubjectRepository.instance) SubjectRepository.instance = new SubjectRepository()
		return SubjectRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<SubjectFromModel>(Subject, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: SubjectToModel) {
		const subject = await new Subject(data).save()
		return this.mapper.mapFrom(subject)!
	}

	async find (id: string) {
		const subject = await Subject.findById(id)
		return this.mapper.mapFrom(subject)
	}

	async update (id: string, data: Partial<SubjectToModel>) {
		const subject = await Subject.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
		return this.mapper.mapFrom(subject)
	}

	async delete (id: string) {
		const subject = await Subject.findOneAndDelete({ _id: id })
		return !!subject
	}
}
