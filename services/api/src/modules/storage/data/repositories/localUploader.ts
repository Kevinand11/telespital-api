import { IUploaderRepository } from '../../domain/irepositories/uploader'
import { dirname, join, resolve } from 'path'
import fs from 'fs'
import { MediaInput } from '../models/media'
import { appId, baseDomain, environment } from '@utils/environment'

export class LocalUploaderRepository implements IUploaderRepository {
	async delete (path: string) {
		const mediaPath = resolve(join(process.cwd(), 'public', decodeURI(path)))
		const exists = fs.existsSync(mediaPath)
		if (exists) fs.unlinkSync(mediaPath)
		return exists
	}

	async upload (path: string, media: MediaInput) {
		const timestamp = Date.now()
		media.name = media.name.toLowerCase()
		path = `storage/${environment}/${path}/${timestamp}-${media.name}`
		const mediaPath = resolve(join(process.cwd(), 'public', path))
		const folder = dirname(mediaPath)
		if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
		fs.writeFileSync(mediaPath, media.data)
		path = encodeURI(path)
		return {
			name: media.name,
			type: media.type,
			size: media.size,
			duration: media.duration,
			path, timestamp,
			link: `${baseDomain}/${appId}/${path}`
		}
	}
}