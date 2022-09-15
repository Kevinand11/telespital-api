import { IEducationRepository } from '../../domain/irepositories/educations'
import { EducationMapper } from '../mappers/educations'
import { EducationFromModel, EducationToModel } from '../models/educations'
import { Education } from '../mongooseModels/educations'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'

export class EducationRepository implements IEducationRepository {
	private static instance: EducationRepository
	private mapper: EducationMapper

	private constructor () {
		this.mapper = new EducationMapper()
	}

	static getInstance () {
		if (!EducationRepository.instance) EducationRepository.instance = new EducationRepository()
		return EducationRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<EducationFromModel>(Education, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: EducationToModel) {
		const education = await new Education(data).save()
		return this.mapper.mapFrom(education)!
	}

	async find (id: string) {
		const education = await Education.findById(id)
		return this.mapper.mapFrom(education)
	}

	async update (id: string, userId: string, data: Partial<EducationToModel>) {
		const education = await Education.findOneAndUpdate({ _id: id, userId }, { $set: data })
		return this.mapper.mapFrom(education)
	}

	async delete (id: string, userId: string) {
		const education = await Education.findOneAndDelete({ _id: id, userId })
		return !!education
	}
}
