import { CardsUseCases } from '@modules/payment'
import { NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { StripePayment } from '@utils/modules/payment/stripe'

export class CardsController {
	static async find (req: Request) {
		const card = await CardsUseCases.find(req.params.id)
		if (!card || card.userId !== req.authUser!.id) return null
		return card
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await CardsUseCases.get(query)
	}

	static async makePrimary (req: Request) {
		const updated = await CardsUseCases.makePrimary({ id: req.params.id, userId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete (req: Request) {
		const isDeleted = await CardsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const { number, expMonth, expYear, cvc } = validate({
			number: req.body.number,
			expMonth: req.body.expMonth,
			expYear: req.body.expYear,
			cvc: req.body.cvc
		}, {
			number: {
				required: true,
				rules: [Validation.isString, Validation.isLongerThanX(15), Validation.isShorterThanX(17)]
			},
			expMonth: {
				required: true,
				rules: [Validation.isNumber, Validation.arrayContainsX([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], (cur, val) => cur === val, 'should be between 1 and 12')]
			},
			expYear: { required: true, rules: [Validation.isNumber] },
			cvc: {
				required: true, rules: [Validation.isString, (val) => Validation.isNumber((parseInt(val))).valid ?
					Validation.isValid() : Validation.isInvalid('not a valid cvc')]
			}
		})

		const cardModel = await StripePayment.createCard(req.authUser!.id, { number, expYear, expMonth, cvc })
		return await CardsUseCases.create(cardModel)
	}
}