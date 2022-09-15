import { MediaInput, MediaOutput } from '../../data/models/media'

export interface IUploaderRepository {
	upload: (_: string, __: MediaInput) => Promise<MediaOutput>
	delete: (_: string) => Promise<boolean>
}