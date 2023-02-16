import { parseQueryParams, QueryParams } from 'equipped'
import { IReportRepository } from '../../domain/irepositories/reports'
import { ReportStatus } from '../../domain/types'
import { ReportMapper } from '../mappers/reports'
import { Report } from '../mongooseModels/reports'
import { ReportFromModel, ReportToModel } from './../models/reports'

export class ReportRepository implements IReportRepository {
	private static instance: ReportRepository
	private mapper: ReportMapper

	private constructor () {
		this.mapper = new ReportMapper()
	}

	static getInstance () {
		if (!ReportRepository.instance) ReportRepository.instance = new ReportRepository()
		return ReportRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<ReportFromModel>(Report, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find (id: string) {
		const report = await Report.findById(id)
		return this.mapper.mapFrom(report)
	}

	async create (data: ReportToModel) {
		const report = await Report.findOneAndUpdate(
			{ userId: data.userId, status: ReportStatus.created },
			{ $setOnInsert: { ...data, status: ReportStatus.created } },
			{ new: true, upsert: true })

		return this.mapper.mapFrom(report)!
	}

	async settle (id: string, userId: string) {
		const settlement = { userId, at: Date.now() }
		const report = await Report.findOneAndUpdate(
			{ _id: id, settlement: null },
			{ $set: { settlement, status: ReportStatus.settled } },
			{ new: true })
		return this.mapper.mapFrom(report)
	}
}
