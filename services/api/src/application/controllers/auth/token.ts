import { getNewTokens } from '@utils/modules/auth'
import { Request } from 'equipped'

export class TokenController {
	static async getNewTokens (req: Request) {
		const accessToken = req.headers.AccessToken ?? ''
		const refreshToken = req.headers.RefreshToken ?? ''
		return await getNewTokens({ accessToken, refreshToken })
	}
}