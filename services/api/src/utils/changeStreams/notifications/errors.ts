import { DbChangeCallbacks } from 'equipped'
import { ErrorEntity, ErrorFromModel } from '@modules/notifications'
import { appInstance } from '@utils/environment'

export const ErrorDbChangeCallbacks: DbChangeCallbacks<ErrorFromModel, ErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	}
}