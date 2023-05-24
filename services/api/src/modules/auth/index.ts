import { AuthRepository } from './data/repositories/auth'
import { UserRepository } from './data/repositories/users'
import { AuthUseCase } from './domain/useCases/auth'
import { AuthUsersUseCase } from './domain/useCases/users'

const authRepository = AuthRepository.getInstance()
const userRepository = UserRepository.getInstance()

export const AuthUseCases = new AuthUseCase(authRepository)
export const AuthUsersUseCases = new AuthUsersUseCase(userRepository)

export { UserFromModel } from './data/models/users'
export { AuthUserEntity } from './domain/entities/users'
export { AuthOutput, AuthUserData, AuthUserType, UserPhone } from './domain/types'
