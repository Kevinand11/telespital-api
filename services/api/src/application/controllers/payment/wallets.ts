import { CurrencyCountries, WalletsUseCases } from '@modules/payment'
import { BadRequestError, Request, validate, Validation, ValidationError } from '@stranerd/api-commons'
import { FlutterwavePayment } from '@utils/modules/payment/flutterwave'

export class WalletsController {
	static async get (req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async getBanks (req: Request) {
		let country = req.params.country as any
		country = Object.values(CurrencyCountries).includes(country) ? country : CurrencyCountries.US
		const banks = await FlutterwavePayment.getBanks(country)
		return banks.sort((a, b) => a.name < b.name ? -1 : 1)
	}

	static async updateAccount (req: Request) {
		const { country, bankCode, number } = validate({
			country: req.body.country,
			number: req.body.number,
			bankCode: req.body.bankCode
		}, {
			country: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(Object.values(CurrencyCountries), (cur, val) => cur === val)]
			},
			number: { required: true, rules: [Validation.isString] },
			bankCode: { required: true, rules: [Validation.isString] }
		})
		const banks = await FlutterwavePayment.getBanks(country)
		const bank = banks.find((b) => b.code === bankCode)
		if (!bank) throw new ValidationError([{ field: 'bankCode', messages: ['is not a supported bank'] }])
		const verified = await FlutterwavePayment.verifyAccount({ number, bankCode })
		if (!verified) throw new BadRequestError('failed to verify account number')
		return await WalletsUseCases.updateAccount({
			userId: req.authUser!.id,
			account: { country, number, bankCode: bank.code, bankName: bank.name }
		})
	}
}