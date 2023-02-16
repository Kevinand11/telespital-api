import { Currencies, MethodsUseCases, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { OrdersUseCases, UsersUseCases } from '@modules/users'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq, Validation } from 'equipped'

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
		const data = validateReq({
			phone: Schema.any().addRule(Validation.isValidPhone()),
			street: Schema.string().min(1),
			city: Schema.string().min(1),
			state: Schema.string().min(1),
			country: Schema.string().min(1),
			description: Schema.string()
		}, req.body)

		return await OrdersUseCases.add({
			...data, userId: req.authUser!.id,
			amount: 50, currency: Currencies.USD
		})
	}

	static async payForOrder (req: Request) {
		const data = validateReq({
			methodId: Schema.string().min(1)
		}, req.body)

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