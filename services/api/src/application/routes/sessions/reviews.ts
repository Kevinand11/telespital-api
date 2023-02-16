import { makeController, Route, StatusCodes } from 'equipped'
import { ReviewsController } from '../../controllers/sessions/reviews'

export const reviewsRoutes: Route[] = [
	{
		path: '/sessions/reviews/',
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
		path: '/sessions/reviews/:id',
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