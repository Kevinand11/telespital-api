import { ReviewsUseCases } from '@modules/sessions'
import { QueryParams, Request } from '@stranerd/api-commons'

export class ReviewsController {
	static async getReviews (req: Request) {
		const query = req.query as QueryParams
		return await ReviewsUseCases.get(query)
	}

	static async findReview (req: Request) {
		return await ReviewsUseCases.find(req.params.id)
	}
}