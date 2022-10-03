import { CloudUploaderRepository } from './data/repositories/cloudUploader'
import { LocalUploaderRepository } from './data/repositories/localUploader'
import { StorageUseCase } from './domain/usecases/storage'
import { isProd } from '@utils/environment'

const uploaderRepository = isProd ? new CloudUploaderRepository() : new LocalUploaderRepository()

export const StorageUseCases = new StorageUseCase(uploaderRepository)