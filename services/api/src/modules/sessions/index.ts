import { SessionRepository } from './data/repositories/sessions'
import { ReviewRepository } from './data/repositories/reviews'
import { MessageRepository } from './data/repositories/messages'
import { SessionsUseCase } from './domain/useCases/sessions'
import { ReviewsUseCase } from './domain/useCases/reviews'
import { MessagesUseCase } from './domain/useCases/messages'

const sessionRepository = SessionRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()
const messageRepository = MessageRepository.getInstance()

export const SessionsUseCases = new SessionsUseCase(sessionRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)
export const MessagesUseCases = new MessagesUseCase(messageRepository)

export { SessionFromModel } from './data/models/sessions'
export { ReviewFromModel } from './data/models/reviews'
export { MessageFromModel } from './data/models/messages'
export { SessionEntity } from './domain/entities/sessions'
export { ReviewEntity } from './domain/entities/reviews'
export { MessageEntity } from './domain/entities/messages'
export { SessionStatus, PrescriptionUnit } from './domain/types'