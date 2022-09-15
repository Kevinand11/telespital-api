import { AccountDetails, Currencies } from '../../domain/types'

export interface WalletFromModel extends WalletToModel {
	_id: string
	balance: { amount: number, currency: Currencies }
	account: AccountDetails | null
	createdAt: number
	updatedAt: number
}

export interface WalletToModel {
	userId: string
}