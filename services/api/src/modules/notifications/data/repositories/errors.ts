import { IErrorRepository } from '../../domain/irepositories/errors'
import { ErrorMapper } from '../mappers/errors'
import { ErrorToModel } from '../models/errors'
import { Error } from '../mongooseModels/errors'

export class ErrorRepository implements IErrorRepository {
	private static instance: ErrorRepository
	private mapper: ErrorMapper

	private constructor () {
		this.mapper = new ErrorMapper()
	}

	static getInstance () {
		if (!ErrorRepository.instance) ErrorRepository.instance = new ErrorRepository()
		return ErrorRepository.instance
	}

	async add (data: ErrorToModel) {
		const error = await new Error(data).save()
		return this.mapper.mapFrom(error)!
	}

	async getAndDeleteAll () {
		const errors = await Error.find()
		await Error.deleteMany()
		return errors.map((error) => this.mapper.mapFrom(error)!)
	}
}