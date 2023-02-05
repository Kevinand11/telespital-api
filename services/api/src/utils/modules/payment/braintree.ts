import { BraintreeGateway, CreditCard, PayPalAccount } from 'braintree'
import { Currencies, MethodToModel, MethodType } from '@modules/payment'
import { braintreeConfig } from '@utils/environment'

const getGateway = () => new BraintreeGateway({
	...braintreeConfig,
	environment: (braintreeConfig.isProd ? 'Production' : 'Sandbox') as any
})

export class BraintreePayment {
	static async generateToken () {
		const res = await getGateway().clientToken.generate({})
		return res.clientToken
	}

	static async createPaymentMethod (userId: string, nonce: string): Promise<MethodToModel | null> {
		const customer = await BraintreePayment.getCustomer(userId)
		const { paymentMethod: method } = await getGateway().paymentMethod.create({
			customerId: customer.id, paymentMethodNonce: nonce
		})
		if (method instanceof PayPalAccount) return {
			token: method.token, userId,
			data: { type: MethodType.Paypal, email: method.email }
		}
		else if (method instanceof CreditCard) {
			const expireTime = new Date(parseInt(method.expirationYear!), parseInt(method.expirationMonth!)).getTime()
			return {
				token: method.token, userId,
				data: {
					type: MethodType.Card,
					last4Digits: method.last4,
					country: method.countryOfIssuance,
					cardType: method.cardType,
					expiredAt: expireTime,
					expired: expireTime <= Date.now()
				}
			}
		} else return null
	}

	static async deletePaymentMethod (token: string) {
		await getGateway().paymentMethod.delete(token)
	}

	static async charge ({ amount, token }: { amount: number, token: string, currency: Currencies }) {
		const res = await getGateway().transaction.sale({ amount: amount.toString(), paymentMethodToken: token })
		return res.success
	}

	static async convertAmount (amount: number, from: Currencies, to: Currencies) {
		if (from === to) return amount
		// TODO: figure how to convert currencies in braintree
		return amount
	}

	private static async getCustomer (userId: string) {
		const customer = await getGateway().customer.find(userId).catch(() => null)
		if (!customer) await getGateway().customer.create({ id: userId })
		return { id: userId }
	}
}
