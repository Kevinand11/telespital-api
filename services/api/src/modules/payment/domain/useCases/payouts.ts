import { QueryParams } from '@stranerd/api-commons'
import { IPayoutRepository } from '../irepositories/payouts'
import { EmbeddedUser } from '../types'

export class PayoutsUseCase {
	repository: IPayoutRepository

	constructor (repo: IPayoutRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async create(userId: string, users: EmbeddedUser[]) {
		return await this.repository.create(userId, users)
	}

	async settle (data: { id: string, userId: string}) {
		return await this.repository.settle(data.id, data.userId)
	}
}