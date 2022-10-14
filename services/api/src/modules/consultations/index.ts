import { ConsultationRepository } from './data/repositories/consultations'
import { ReviewRepository } from './data/repositories/reviews'
import { ConsultationsUseCase } from './domain/useCases/consultations'
import { ReviewsUseCase } from './domain/useCases/reviews'

const consultationRepository = ConsultationRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()

export const ConsultationsUseCases = new ConsultationsUseCase(consultationRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)

export { ConsultationFromModel } from './data/models/consultations'
export { ReviewFromModel } from './data/models/reviews'
export { ConsultationEntity } from './domain/entities/consultations'
export { ReviewEntity } from './domain/entities/reviews'
export { ConsultationStatus, PrescriptionUnit } from './domain/types'