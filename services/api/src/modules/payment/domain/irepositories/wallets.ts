import { WalletEntity } from '../entities/wallets'
import { AccountDetails } from '../types'

export interface IWalletRepository {
	get: (userId: string) => Promise<WalletEntity>
	updateAmount: (userId: string, amount: number) => Promise<boolean>
	updateAccount: (userId: string, account: AccountDetails) => Promise<WalletEntity>
}
