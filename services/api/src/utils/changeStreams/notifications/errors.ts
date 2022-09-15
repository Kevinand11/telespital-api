import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { ErrorEntity, ErrorFromModel } from '@modules/notifications'
import { appInstance } from '@utils/environment'

export const ErrorChangeStreamCallbacks: ChangeStreamCallbacks<ErrorFromModel, ErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	}
}