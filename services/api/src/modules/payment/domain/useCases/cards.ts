import { QueryParams } from '@stranerd/api-commons'
import { ICardRepository } from '../irepositories/cards'
import { CardToModel } from '../../data/models/cards'

export class CardsUseCase {
	repository: ICardRepository

	constructor (repo: ICardRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async create (data: CardToModel) {
		return await this.repository.create(data)
	}

	async makePrimary (data: { id: string, userId: string }) {
		return await this.repository.makePrimary(data.id, data.userId)
	}

	async markExpireds () {
		return await this.repository.markExpireds()
	}

	async delete (data: { id: string, userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}
}