import { TokenEntity } from '../entities/tokens'

export interface ITokenRepository {
	updateTokens: (userId: string, tokens: string[], add: boolean) => Promise<TokenEntity>
	find: (userId: string) => Promise<TokenEntity>
	delete: (userId: string) => Promise<boolean>
}
