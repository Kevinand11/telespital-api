import { IWorkRepository } from '../../domain/irepositories/works'
import { WorkMapper } from '../mappers/works'
import { WorkFromModel, WorkToModel } from '../models/works'
import { Work } from '../mongooseModels/works'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'

export class WorkRepository implements IWorkRepository {
	private static instance: WorkRepository
	private mapper: WorkMapper

	private constructor () {
		this.mapper = new WorkMapper()
	}

	static getInstance () {
		if (!WorkRepository.instance) WorkRepository.instance = new WorkRepository()
		return WorkRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<WorkFromModel>(Work, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: WorkToModel) {
		const work = await new Work(data).save()
		return this.mapper.mapFrom(work)!
	}

	async find (id: string) {
		const work = await Work.findById(id)
		return this.mapper.mapFrom(work)
	}

	async update (id: string, userId: string, data: Partial<WorkToModel>) {
		const work = await Work.findOneAndUpdate({ _id: id, userId }, { $set: data })
		return this.mapper.mapFrom(work)
	}

	async delete (id: string, userId: string) {
		const work = await Work.findOneAndDelete({ _id: id, userId })
		return !!work
	}
}
