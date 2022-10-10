import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { ConsultationEntity, ConsultationFromModel } from '@modules/consultations'
import { getSocketEmitter } from '@index'

export const ConsultationChangeStreamCallbacks: ChangeStreamCallbacks<ConsultationFromModel, ConsultationEntity> = {
	created: async ({ after }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitCreated(`consultations/consultations/${id}`, after)
				await getSocketEmitter().emitCreated(`consultations/consultations/${id}/${after.id}`, after)
			})
		)
	},
	updated: async ({ after }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitUpdated(`consultations/consultations/${id}`, after)
				await getSocketEmitter().emitUpdated(`consultations/consultations/${id}/${after.id}`, after)
			})
		)
	},
	deleted: async ({ before }) => {
		await Promise.all(
			before.getParticipants().map(async (id) => {
				await getSocketEmitter().emitDeleted(`consultations/consultations/${id}`, before)
				await getSocketEmitter().emitDeleted(`consultations/consultations/${id}/${before.id}`, before)
			})
		)
	}
}