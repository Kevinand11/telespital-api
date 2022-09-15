import { ErrorRepository } from './data/repositories/errors'
import { NotificationRepository } from './data/repositories/notifications'
import { TokenRepository } from './data/repositories/tokens'
import { EmailsUseCase } from './domain/useCases/emails'
import { NotificationsUseCase } from './domain/useCases/notifications'
import { TokensUseCase } from './domain/useCases/tokens'

const errorRepository = ErrorRepository.getInstance()
const notificationRepository = NotificationRepository.getInstance()
const tokenRepository = TokenRepository.getInstance()

export const EmailsUseCases = new EmailsUseCase(errorRepository)
export const NotificationsUseCases = new NotificationsUseCase(notificationRepository)
export const TokensUseCases = new TokensUseCase(tokenRepository)

export { ErrorFromModel } from './data/models/errors'
export { NotificationFromModel, NotificationToModel } from './data/models/notifications'
export { TokenFromModel } from './data/models/tokens'
export { ErrorEntity } from './domain/entities/errors'
export { NotificationEntity } from './domain/entities/notifications'
export { TokenEntity } from './domain/entities/tokens'
export { NotificationType } from './domain/types'