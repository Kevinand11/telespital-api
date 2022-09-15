import { ITokenRepository } from '../../domain/irepositories/tokens'
import { TokenMapper } from '../mappers/tokens'
import { Token } from '../mongooseModels/tokens'

export class TokenRepository implements ITokenRepository {
	private static instance: TokenRepository
	private mapper: TokenMapper

	private constructor () {
		this.mapper = new TokenMapper()
	}

	static getInstance () {
		if (!TokenRepository.instance) TokenRepository.instance = new TokenRepository()
		return TokenRepository.instance
	}

	async updateTokens (userId: string, tokens: string[], add: boolean) {
		if (add) await Token.updateMany(
			{ tokens: { $in: tokens }, userId: { $ne: userId } },
			{ $pull: { tokens: { $in: tokens } } }
		)
		const token = await Token.findOneAndUpdate({ userId }, {
			$set: { userId },
			[add ? '$addToSet' : '$pull']: { 'tokens': { [add ? '$each' : '$in']: tokens } }
		}, { upsert: true })
		return this.mapper.mapFrom(token)!
	}

	async find (userId: string) {
		let token = await Token.findOne({ userId })
		if (!token) token = await Token.create({ userId })
		return this.mapper.mapFrom(token)!
	}

	async delete (userId: string) {
		const res = await Token.deleteMany({ userId })
		return res.acknowledged
	}
}