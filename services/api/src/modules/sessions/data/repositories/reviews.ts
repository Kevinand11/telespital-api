import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IReviewRepository } from '../../domain/irepositories/reviews'
import { EmbeddedUser } from '../../domain/types'
import { ReviewMapper } from '../mappers/reviews'
import { ReviewToModel } from '../models/reviews'
import { Review } from '../mongooseModels/reviews'

export class ReviewRepository implements IReviewRepository {
	private static instance: ReviewRepository
	private mapper: ReviewMapper

	private constructor () {
		this.mapper = new ReviewMapper()
	}

	static getInstance () {
		if (!ReviewRepository.instance) ReviewRepository.instance = new ReviewRepository()
		return ReviewRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Review, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find (id: string) {
		const review = await Review.findById(id)
		return this.mapper.mapFrom(review)
	}

	async update (id: string, userId: string, data: Partial<ReviewToModel>) {
		const review = await Review.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(review)
	}

	async updateUserBio (user: EmbeddedUser) {
		const res = await Review.updateMany({ 'user.id': user.id }, { $set: { user } })
		return res.acknowledged
	}
}
