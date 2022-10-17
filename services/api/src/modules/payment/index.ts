import { TransactionRepository } from './data/repositories/transactions'
import { MethodRepository } from './data/repositories/methods'
import { WalletRepository } from './data/repositories/wallets'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { MethodsUseCase } from './domain/useCases/methods'
import { WalletsUseCase } from './domain/useCases/wallets'

const transactionRepository = TransactionRepository.getInstance()
const methodRepository = MethodRepository.getInstance()
const walletRepository = WalletRepository.getInstance()

export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const MethodsUseCases = new MethodsUseCase(methodRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)

export { TransactionFromModel } from './data/models/transactions'
export { MethodFromModel, MethodToModel } from './data/models/methods'
export { WalletFromModel } from './data/models/wallets'
export { TransactionEntity } from './domain/entities/transactions'
export { MethodEntity } from './domain/entities/methods'
export { WalletEntity } from './domain/entities/wallets'
export { Currencies, TransactionType, TransactionStatus, MethodType } from './domain/types'
