import { ITokenRepository } from '../irepositories/tokens'

export class TokensUseCase {
	private repository: ITokenRepository

	constructor (repository: ITokenRepository) {
		this.repository = repository
	}

	async delete (userId: string) {
		return await this.repository.delete(userId)
	}

	async find (data: { userId: string }) {
		return await this.repository.find(data.userId)
	}

	async update (data: { userId: string, tokens: string[], add: boolean }) {
		return await this.repository.updateTokens(data.userId, data.tokens, data.add)
	}
}
