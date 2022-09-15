import { CloudUploaderRepository } from './data/repositories/cloudUploader'
import { LocalUploaderRepository } from './data/repositories/localUploader'
import { StorageUseCase } from './domain/usecases/storage'
import { isDev } from '@utils/environment'

const uploaderRepository = isDev ? new LocalUploaderRepository() : new CloudUploaderRepository()

export const StorageUseCases = new StorageUseCase(uploaderRepository)