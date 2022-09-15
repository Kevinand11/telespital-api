import { IWalletRepository } from '../../domain/irepositories/wallets'
import { WalletMapper } from '../mappers/wallets'
import { Wallet } from '../mongooseModels/wallets'
import { AccountDetails } from '../../domain/types'

export class WalletRepository implements IWalletRepository {
	private static instance: WalletRepository
	private mapper: WalletMapper

	private constructor () {
		this.mapper = new WalletMapper()
	}

	static getInstance () {
		if (!WalletRepository.instance) WalletRepository.instance = new WalletRepository()
		return WalletRepository.instance
	}

	private static async getUserWallet (userId: string) {
		const wallet = await Wallet.findOneAndUpdate(
			{ userId },
			{ $setOnInsert: { userId } },
			{ upsert: true, new: true })
		return wallet!
	}

	async get (userId: string) {
		const wallet = await WalletRepository.getUserWallet(userId)
		return this.mapper.mapFrom(wallet)!
	}

	async updateAmount (userId: string, amount: number) {
		let wallet = await WalletRepository.getUserWallet(userId)
		wallet = (await Wallet.findByIdAndUpdate(wallet._id, { $inc: { amount } }, { new: true }))!
		return this.mapper.mapFrom(wallet)!
	}

	async updateAccount (userId: string, account: AccountDetails) {
		let wallet = await WalletRepository.getUserWallet(userId)
		wallet = (await Wallet.findByIdAndUpdate(wallet._id, { $set: { account } }, { new: true }))!
		return this.mapper.mapFrom(wallet)!
	}
}
