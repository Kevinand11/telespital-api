import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { SessionEntity, SessionFromModel } from '@modules/sessions'
import { getSocketEmitter } from '@index'
import { TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { UserMeta, UsersUseCases } from '@modules/users'

export const SessionChangeStreamCallbacks: ChangeStreamCallbacks<SessionFromModel, SessionEntity> = {
	created: async ({ after }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitCreated(`sessions/sessions/${id}`, after)
				await getSocketEmitter().emitCreated(`sessions/sessions/${id}/${after.id}`, after)
			})
		)
	},
	updated: async ({ after, changes }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitUpdated(`sessions/sessions/${id}`, after)
				await getSocketEmitter().emitUpdated(`sessions/sessions/${id}/${after.id}`, after)
			})
		)

		if (changes.cancelled && after.cancelled && after.paid) await TransactionsUseCases.create({
			userId: after.patient.id, email: after.patient.bio.email,
			title: `Refund for Session: ${after.id}`,
			amount: after.price, currency: after.currency,
			status: TransactionStatus.fulfilled,
			data: { type: TransactionType.RefundSession, sessionId: after.id }
		})

		if (changes.closedAt && after.closedAt && !after.cancelled) await Promise.all([
			UsersUseCases.incrementMeta({
				ids: [after.patient.id],
				value: 1,
				property: UserMeta.sessionsAttended
			}),
			after.doctor && UsersUseCases.incrementMeta({
				ids: [after.doctor.id],
				value: 1,
				property: UserMeta.sessionsHosted
			})
		])
	},
	deleted: async ({ before }) => {
		await Promise.all(
			before.getParticipants().map(async (id) => {
				await getSocketEmitter().emitDeleted(`sessions/sessions/${id}`, before)
				await getSocketEmitter().emitDeleted(`sessions/sessions/${id}/${before.id}`, before)
			})
		)

		if (before.closedAt && !before.cancelled) await Promise.all([
			UsersUseCases.incrementMeta({
				ids: [before.patient.id],
				value: -1,
				property: UserMeta.sessionsAttended
			}),
			before.doctor && UsersUseCases.incrementMeta({
				ids: [before.doctor.id],
				value: -1,
				property: UserMeta.sessionsHosted
			})
		])
	}
}