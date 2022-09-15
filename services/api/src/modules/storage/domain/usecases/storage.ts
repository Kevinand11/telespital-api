import { IUploaderRepository } from '../irepositories/uploader'
import { MediaInput } from '@modules/storage/data/models/media'

export class StorageUseCase {
	private readonly repository: IUploaderRepository

	constructor (repository: IUploaderRepository) {
		this.repository = repository
	}

	async delete (path: string) {
		return await this.repository.delete(path)
	}

	async upload (path: string, media: MediaInput) {
		return await this.repository.upload(path, media)
	}
}