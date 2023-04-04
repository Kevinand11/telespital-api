import { ReportsUseCases, SessionsUseCases } from '@modules/sessions'
import { NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class ReportsController {
	static async find (req: Request) {
		const report = await ReportsUseCases.find(req.params.id)
		return report
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await ReportsUseCases.get(query)
	}

	static async create (req: Request) {
		const { message, sessionId } = validate({
			message: Schema.string(),
			sessionId: Schema.string().min(1)
		}, req.body)

		const userId = req.authUser!.id
		const session = await SessionsUseCases.find(sessionId)
		if (!session || !session.canReport(userId)) throw new NotAuthorizedError('you can\'t report this session')
		return await ReportsUseCases.create({
			userId, message, data: {
				sessionId: session.id,
				doctor: session.doctor!, patient: session.patient
			}
		})
	}

	static async settle (req: Request) {
		return await ReportsUseCases.settle({
			id: req.params.id,
			userId: req.authUser!.id
		})
	}
}