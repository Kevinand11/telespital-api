import { AuthUseCases } from '@modules/auth'
import { Request, validate, Validation } from '@stranerd/api-commons'
import { generateAuthOutput } from '@utils/modules/auth'

export class IdentitiesController {
	static async googleSignIn (req: Request) {
		const validatedData = validate({
			accessToken: req.body.accessToken,
			idToken: req.body.idToken
		}, {
			accessToken: { required: true, rules: [Validation.isString] },
			idToken: { required: true, rules: [Validation.isString] }
		})

		const data = await AuthUseCases.googleSignIn(validatedData)
		return await generateAuthOutput(data)
	}
}