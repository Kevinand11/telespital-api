import { UserRepository } from './data/repositories/users'
import { UsersUseCase } from './domain/useCases/users'

const userRepository = UserRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)

export { UserFromModel } from './data/models/users'
export { UserEntity } from './domain/entities/users'
export { UserBio, UserRoles, EmbeddedUser, UserMeta } from './domain/types'