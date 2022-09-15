import { BaseEntity } from '@stranerd/api-commons'
import { AccountDetails, Currencies } from '../types'

export class WalletEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly balance: { amount: number, currency: Currencies }
	public readonly account: AccountDetails | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, userId, balance, account, createdAt, updatedAt
	             }: WalletConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.balance = balance
		this.account = account
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type WalletConstructorArgs = {
	id: string
	userId: string
	balance: { amount: number, currency: Currencies }
	account: AccountDetails | null
	createdAt: number
	updatedAt: number
}