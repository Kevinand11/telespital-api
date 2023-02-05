import { SessionRepository } from './data/repositories/sessions'
import { ReviewRepository } from './data/repositories/reviews'
import { MessageRepository } from './data/repositories/messages'
import { ReportRepository } from './data/repositories/reports'
import { SessionsUseCase } from './domain/useCases/sessions'
import { ReviewsUseCase } from './domain/useCases/reviews'
import { MessagesUseCase } from './domain/useCases/messages'
import { ReportsUseCase } from './domain/useCases/reports'

const sessionRepository = SessionRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()
const messageRepository = MessageRepository.getInstance()
const reportRepository = ReportRepository.getInstance()

export const SessionsUseCases = new SessionsUseCase(sessionRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)
export const MessagesUseCases = new MessagesUseCase(messageRepository)
export const ReportsUseCases = new ReportsUseCase(reportRepository)

export { SessionFromModel } from './data/models/sessions'
export { ReviewFromModel } from './data/models/reviews'
export { MessageFromModel } from './data/models/messages'
export { ReportFromModel } from './data/models/reports'
export { SessionEntity } from './domain/entities/sessions'
export { ReviewEntity } from './domain/entities/reviews'
export { MessageEntity } from './domain/entities/messages'
export { ReportEntity } from './domain/entities/reports'
export { SessionStatus, PrescriptionUnit } from './domain/types'