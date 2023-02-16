import { ReportEntity, ReportFromModel } from '@modules/sessions'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const ReportChangeStreamCallbacks: ChangeStreamCallbacks<ReportFromModel, ReportEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('sessions/reports', after)
		await appInstance.listener.created(`sessions/reports/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('sessions/reports', after)
		await appInstance.listener.updated(`sessions/reports/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('sessions/reports', before)
		await appInstance.listener.deleted(`sessions/reports/${before.id}`, before)
	}
}