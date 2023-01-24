import { OrdersUseCases, UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { Currencies, MethodsUseCases, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { isValidPhone } from '@utils/modules/auth'

export class OrdersController {
	static async getOrders (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await OrdersUseCases.get(query)
	}

	static async findOrder (req: Request) {
		const order = await OrdersUseCases.find(req.params.id)
		if (!order || order.userId !== req.authUser!.id) return null
		return order
	}

	static async createOrder (req: Request) {
		const data = validate({
			phone: req.body.phone,
			street: req.body.street,
			city: req.body.city,
			state: req.body.state,
			country: req.body.country,
			description: req.body.description
		}, {
			phone: { required: true, rules: [isValidPhone] },
			street: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			city: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			state: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			country: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			description: { required: true, rules: [Validation.isString] }
		})

		return await OrdersUseCases.add({
			...data, userId: req.authUser!.id,
			amount: 50, currency: Currencies.USD
		})
	}

	static async payForOrder (req: Request) {
		const data = validate({
			methodId: req.body.methodId
		}, {
			methodId: { required: true, rules: [Validation.isString] }
		})

		const userId = req.authUser!.id
		const order = await OrdersUseCases.find(req.params.id)
		if (!order || order.userId !== req.authUser!.id) throw new NotAuthorizedError('cant pay for this order')
		if (order.paid) return true
		const method = await MethodsUseCases.find(data.methodId)
		if (!method || method.userId !== userId) throw new BadRequestError('invalid method')
		const user = await UsersUseCases.find(userId)
		if (!user) throw new BadRequestError('profile not found')
		const email = user.bio.email

		const successful = await BraintreePayment.charge({
			token: method.token, currency: order.currency, amount: order.amount
		})

		await TransactionsUseCases.create({
			email, userId, status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed,
			title: 'Paid for RPM', amount: 0 - order.amount, currency: order.currency,
			data: { type: TransactionType.PayForRPM, orderId: order.id }
		})

		return successful
	}
}