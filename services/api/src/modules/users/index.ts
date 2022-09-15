import { UserRepository } from './data/repositories/users'
import { EducationRepository } from './data/repositories/educations'
import { WorkRepository } from './data/repositories/works'
import { UsersUseCase } from './domain/useCases/users'
import { EducationsUseCase } from './domain/useCases/educations'
import { WorksUseCase } from './domain/useCases/works'

const userRepository = UserRepository.getInstance()
const educationRepository = EducationRepository.getInstance()
const workRepository = WorkRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const EducationsUseCases = new EducationsUseCase(educationRepository)
export const WorksUseCases = new WorksUseCase(workRepository)

export { UserFromModel } from './data/models/users'
export { EducationFromModel } from './data/models/educations'
export { WorkFromModel } from './data/models/works'
export { UserEntity } from './domain/entities/users'
export { EducationEntity } from './domain/entities/educations'
export { WorkEntity } from './domain/entities/works'
export { UserBio, UserRoles, EmbeddedUser, UserMeta } from './domain/types'