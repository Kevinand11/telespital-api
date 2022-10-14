import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { ReviewsController } from '../../controllers/sessions/reviews'

export const reviewsRoutes: Route[] = [
	{
		path: '/reviews/reviews/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReviewsController.getReviews(req)
				}
			})
		]
	},
	{
		path: '/reviews/reviews/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReviewsController.findReview(req)
				}
			})
		]
	}
]