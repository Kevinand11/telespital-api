import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { UserEntity, UserFromModel, UsersUseCases } from '@modules/users'
import { getSocketEmitter } from '@index'
import { AnswersUseCases, QuestionsUseCases } from '@modules/questions'
import { SupportedAuthRoles } from '@utils/types'
import { sendNotification } from '@utils/modules/notifications/notifications'
import { NotificationType } from '@modules/notifications'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('users/users', after)
		await getSocketEmitter().emitCreated(`users/users/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await getSocketEmitter().emitUpdated('users/users', after)
		await getSocketEmitter().emitUpdated(`users/users/${after.id}`, after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			QuestionsUseCases, AnswersUseCases
		].map(async (useCase: any) => await useCase.execute({
			userId: after.id,
			userBio: after.bio,
			userRoles: after.roles
		})))
		if (changes.roles?.[SupportedAuthRoles.isTutor]) {
			const upgraded = after.roles[SupportedAuthRoles.isTutor]
			if (!upgraded) await UsersUseCases.removeSavedTutors(before.id)
			await sendNotification([after.id], {
				title: 'Tutoring role updated',
				body: upgraded ? 'You have been upgraded to a tutor' : 'You have been demoted from tutoring',
				sendEmail: true, data: { type: NotificationType.RoleUpdated }
			})
		}
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('users/users', before)
		await getSocketEmitter().emitDeleted(`users/users/${before.id}`, before)
	}
}