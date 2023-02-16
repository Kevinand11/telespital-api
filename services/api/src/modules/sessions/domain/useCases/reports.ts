import { QueryParams } from 'equipped'
import { IReportRepository } from '../irepositories/reports'
import { ReportToModel } from './../../data/models/reports'

export class ReportsUseCase {
	repository: IReportRepository

	constructor (repo: IReportRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async create (data: ReportToModel) {
		return await this.repository.create(data)
	}

	async settle (data: { id: string, userId: string }) {
		return await this.repository.settle(data.id, data.userId)
	}
}