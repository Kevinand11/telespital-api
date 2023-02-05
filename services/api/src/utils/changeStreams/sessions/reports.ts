import { getSocketEmitter } from '@index'
import { ReportEntity, ReportFromModel } from '@modules/sessions'
import { ChangeStreamCallbacks } from '@stranerd/api-commons'

export const ReportChangeStreamCallbacks: ChangeStreamCallbacks<ReportFromModel, ReportEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('sessions/reports', after)
		await getSocketEmitter().emitCreated(`sessions/reports/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('sessions/reports', after)
		await getSocketEmitter().emitUpdated(`sessions/reports/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('sessions/reports', before)
		await getSocketEmitter().emitDeleted(`sessions/reports/${before.id}`, before)
	}
}