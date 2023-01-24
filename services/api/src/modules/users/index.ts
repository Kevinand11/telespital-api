import { UserRepository } from './data/repositories/users'
import { OrderRepository } from './data/repositories/orders'
import { UsersUseCase } from './domain/useCases/users'
import { OrdersUseCase } from './domain/useCases/orders'

const userRepository = UserRepository.getInstance()
const orderRepository = OrderRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const OrdersUseCases = new OrdersUseCase(orderRepository)

export { UserFromModel } from './data/models/users'
export { OrderFromModel } from './data/models/orders'
export { generateDefaultUser, UserEntity } from './domain/entities/users'
export { OrderEntity } from './domain/entities/orders'
export { UserBio, UserRoles, EmbeddedUser, UserMeta } from './domain/types'