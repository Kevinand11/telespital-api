import { MessagesUseCases, SessionsUseCases } from '@modules/sessions'
import { StorageUseCases } from '@modules/storage'
import { Conditions, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class MessageController {
	static async getMessages (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'members', condition: Conditions.in, value: req.authUser!.id }]
		return await MessagesUseCases.get(query)
	}

	static async findMessage (req: Request) {
		const message = await MessagesUseCases.find(req.params.id)
		if (!message || !message.members.includes(req.authUser!.id)) return null
		return message
	}

	static async addMessage (req: Request) {
		const { body, sessionId, media: mediaFile } = validateReq({
			body: Schema.string(),
			sessionId: Schema.string().min(1),
			media: Schema.file().nullable()
		}, { ...req.body, media: req.files.media?.[0] ?? null })

		const media = mediaFile ? await StorageUseCases.upload('sessions/messages', mediaFile) : null

		const authUserId = req.authUser!.id
		const session = await SessionsUseCases.find(sessionId)
		if (!session || !session.getParticipants().includes(authUserId)) throw new NotAuthorizedError('cant message in this session')
		if (!session.isOngoing()) throw new NotAuthorizedError('cant only message if the session is ongoing')

		return await MessagesUseCases.add({
			body, media, from: authUserId, sessionId, members: session.getParticipants()
		})
	}

	static async markMessageRead (req: Request) {
		const data = validateReq({
			sessionId: Schema.string().min(1)
		}, req.body)

		return await MessagesUseCases.markRead({
			from: req.authUser!.id, sessionId: data.sessionId
		})
	}
}