import Stripe from 'stripe'
import { stripeConfig } from '@utils/environment'
import { CardToModel, Currencies } from '@modules/payment'

const stripe = () => new Stripe(stripeConfig.secretKey, { apiVersion: '2022-08-01' })

export class StripePayment {
	static async createCard (userId: string, data: { number: string, expMonth: number, expYear: number, cvc: string }): Promise<CardToModel> {
		const customer = await StripePayment.getCustomer(userId)
		const card = await stripe().paymentMethods.create({
			type: 'card',
			card: {
				number: data.number,
				exp_month: data.expMonth,
				exp_year: data.expYear,
				cvc: data.cvc
			},
			metadata: { userId }
		})
		await stripe().paymentMethods.attach(card.id, { customer: customer.id })
		const details = card.card!
		return {
			last4Digits: details.last4,
			country: details.country ?? '',
			type: details.brand,
			token: card.id,
			expiredAt: new Date(details.exp_year, details.exp_month).getTime(),
			userId
		}
	}

	static async deleteCard (token: string) {
		await stripe().paymentMethods.detach(token)
	}

	static async chargeCard (data: {
		userId: string, token: string, currency: Currencies
		amount: number, email: string
	}) {
		const customer = await StripePayment.getCustomer(data.userId)
		const intent = await stripe().paymentIntents.create({
			customer: customer.id,
			setup_future_usage: 'off_session', confirm: true,
			amount: data.amount * 100, currency: data.currency,
			payment_method_types: ['card'],
			payment_method: data.token,
			metadata: { userId: data.userId }
		})
		return intent.status === 'succeeded'
	}

	static async convertAmount (amount: number, from: Currencies, to: Currencies) {
		if (from === to) return amount
		// TODO: figure how to convert currencies in stripe
		return amount
	}

	private static async getCustomer (userId: string) {
		const customers = await stripe().customers.search({
			query: `metadata['userId']:'${userId}'`,
			limit: 1
		})
		const customer = customers.data[0] ?? null
		if (customer) return customer
		return await stripe().customers.create({
			metadata: { userId }
		})
	}
}