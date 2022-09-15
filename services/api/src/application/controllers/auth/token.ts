import { Request } from '@stranerd/api-commons'
import { getNewTokens } from '@utils/modules/auth'

export class TokenController {
	static async getNewTokens (req: Request) {
		const accessToken = req.headers.AccessToken
		const refreshToken = req.headers.RefreshToken
		return await getNewTokens({ accessToken, refreshToken })
	}
}