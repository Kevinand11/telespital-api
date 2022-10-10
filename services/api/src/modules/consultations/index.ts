import { ConsultationRepository } from './data/repositories/consultations'
import { ConsultationsUseCase } from './domain/useCases/consultations'

const consultationRepository = ConsultationRepository.getInstance()

export const ConsultationsUseCases = new ConsultationsUseCase(consultationRepository)

export { ConsultationFromModel } from './data/models/consultations'
export { ConsultationEntity } from './domain/entities/consultations'
export { ConsultationStatus, PrescriptionUnit } from './domain/types'