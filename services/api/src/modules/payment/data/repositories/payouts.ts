import { EmbeddedUser, PayoutPay, PayoutStatus, TransactionStatus, TransactionType } from '../../domain/types'
import { mongoose, parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { IPayoutRepository } from '../../domain/irepositories/payouts'
import { PayoutMapper } from '../mappers/payouts'
import { Payout } from '../mongooseModels/payouts'
import { PayoutFromModel } from './../models/payouts'
import { Wallet } from '../mongooseModels/wallets'
import { Transaction } from '../mongooseModels/transactions'
import { TransactionToModel } from '../models/transactions'

export class PayoutRepository implements IPayoutRepository {
	private static instance: PayoutRepository
	private mapper: PayoutMapper

	private constructor () {
		this.mapper = new PayoutMapper()
	}

	static getInstance () {
		if (!PayoutRepository.instance) PayoutRepository.instance = new PayoutRepository()
		return PayoutRepository.instance
	}

	async get(query: QueryParams) {
		const data = await parseQueryParams<PayoutFromModel>(Payout, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find(id: string) {
		const payout = await Payout.findById(id)
		return this.mapper.mapFrom(payout)
	}

	async create(userId: string, users: EmbeddedUser[]) {
		let res = null as any
		const session = await mongoose.startSession()
		await session.withTransaction(async (session) => {
			const id = new mongoose.Types.ObjectId().toString()
			const transactionModels: TransactionToModel[] = []
			const userDataPromise: Promise<[string, PayoutPay[string]]>[] = users.map(async (user) => {
				const wallet = await Wallet.findOneAndUpdate(
					{ userId: user.id, 'balance.amount': { $gt: 0 } },
					{ $set: { 'balance.amount': 0 } },
					{ new: false, session })
				// dont include user if no wallet or wallet balance is 0
				if (!wallet?.balance.amount) return null as any
				const balance = wallet.balance
				transactionModels.push({
					...balance, title: 'Payout generated',
					userId: user.id, email: user.bio.email,
					status: TransactionStatus.fulfilled,
					data: { payoutId: id, type: TransactionType.NewPayout }
				})
				return [userId, { ...balance }]
			})
			const userData = (await Promise.all(userDataPromise)).filter((d) => !!d)
			const pay = Object.fromEntries(userData)
			res = new Payout({ id, userId, pay, status: PayoutStatus.created }).save({ session })
			await Transaction.insertMany(transactionModels, { session })
			return res
		})
		await session.endSession()
		return this.mapper.mapFrom(res)!
	}
}
