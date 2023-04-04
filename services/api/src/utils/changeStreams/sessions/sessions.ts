import { Currencies, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { MessagesUseCases, SessionEntity, SessionFromModel } from '@modules/sessions'
import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { LiveVideo } from '@utils/modules/sessions/video'
import { DbChangeCallbacks } from 'equipped'

export const SessionDbChangeCallbacks: DbChangeCallbacks<SessionFromModel, SessionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(after.getParticipants().map((userId) => [
			`sessions/sessions/${userId}`, `sessions/sessions/${after.id}/${userId}`
		]).flat(), after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created(after.getParticipants().map((userId) => [
			`sessions/sessions/${userId}`, `sessions/sessions/${after.id}/${userId}`
		]).flat(), after)

		if (changes.cancelled && after.cancelled && after.paid) await TransactionsUseCases.create({
			userId: after.patient.id, email: after.patient.bio.email,
			title: `Refund for session: ${after.id}`,
			amount: after.price, currency: after.currency,
			status: TransactionStatus.fulfilled,
			data: { type: TransactionType.RefundSession, sessionId: after.id }
		})

		if (changes.closedAt && !before.closedAt && after.closedAt && !after.cancelled) await Promise.all([
			after.doctor && await TransactionsUseCases.create({
				userId: after.doctor.id, email: after.doctor.bio.email,
				title: `You received payment for session: ${after.id}`,
				amount: after.price, currency: after.currency,
				status: TransactionStatus.fulfilled,
				data: { type: TransactionType.ReceiveSessionPayment, sessionId: after.id }
			}),
			UsersUseCases.incrementMeta({
				ids: [after.patient.id],
				value: 1,
				property: UserMeta.sessionsAttended
			}),
			after.doctor && UsersUseCases.incrementMeta({
				ids: [after.doctor.id],
				value: 1,
				property: UserMeta.sessionsHosted
			}),
			after.doctor && UsersUseCases.incrementMeta({
				ids: [after.doctor.id],
				value: await BraintreePayment.convertAmount(after.price, after.currency, Currencies.USD),
				property: UserMeta.sessionsEarnings
			}),
			LiveVideo.endRoom(after.id)
		])
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(before.getParticipants().map((userId) => [
			`sessions/sessions/${userId}`, `sessions/sessions/${before.id}/${userId}`
		]).flat(), before)

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
			}),
			before.doctor && UsersUseCases.incrementMeta({
				ids: [before.doctor.id],
				value: await BraintreePayment.convertAmount(-before.price, before.currency, Currencies.USD),
				property: UserMeta.sessionsEarnings
			})
		])

		await MessagesUseCases.deleteSessionMessages(before.id)
	}
}