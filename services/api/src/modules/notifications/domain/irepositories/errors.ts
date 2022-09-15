import { ErrorToModel } from '../../data/models/errors'
import { ErrorEntity } from '../entities/errors'

export interface IErrorRepository {
	add: (data: ErrorToModel) => Promise<ErrorEntity>
	getAndDeleteAll: () => Promise<ErrorEntity[]>
}
