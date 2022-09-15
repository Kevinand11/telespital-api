import { AuthRepository } from './data/repositories/auth'
import { UserRepository } from './data/repositories/users'
import { AuthUseCase } from './domain/useCases/auth'
import { AuthUsersUseCase } from './domain/useCases/users'

const authRepository = AuthRepository.getInstance()
const userRepository = UserRepository.getInstance()

export const AuthUseCases = new AuthUseCase(authRepository)
export const AuthUsersUseCases = new AuthUsersUseCase(userRepository)

export { AuthUserEntity } from './domain/entities/users'
export { UserFromModel } from './data/models/users'
export { AuthOutput, AuthUserType } from './domain/types'