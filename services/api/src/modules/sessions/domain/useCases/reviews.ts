import { IReviewRepository } from '../irepositories/reviews'
import { ReviewToModel } from '../../data/models/reviews'
import { QueryParams } from 'equipped'
import { EmbeddedUser } from '../types'

export class ReviewsUseCase {
	private repository: IReviewRepository

	constructor (repository: IReviewRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async update (data: { id: string, userId: string, data: Partial<ReviewToModel> }) {
		return await this.repository.update(data.id, data.userId, data.data)
	}
}
