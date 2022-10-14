import { SessionRepository } from './data/repositories/sessions'
import { ReviewRepository } from './data/repositories/reviews'
import { SessionsUseCase } from './domain/useCases/sessions'
import { ReviewsUseCase } from './domain/useCases/reviews'

const sessionRepository = SessionRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()

export const SessionsUseCases = new SessionsUseCase(sessionRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)

export { SessionFromModel } from './data/models/sessions'
export { ReviewFromModel } from './data/models/reviews'
export { SessionEntity } from './domain/entities/sessions'
export { ReviewEntity } from './domain/entities/reviews'
export { SessionStatus, PrescriptionUnit } from './domain/types'