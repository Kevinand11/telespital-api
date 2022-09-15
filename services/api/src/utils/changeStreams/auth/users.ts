import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { AuthUserEntity, UserFromModel } from '@modules/auth'
import { UsersUseCases } from '@modules/users'
import { EventTypes, publishers } from '@utils/events'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, AuthUserEntity> = {
	created: async ({ after }) => {
		await UsersUseCases.createUserWithBio({
			id: after.id,
			data: {
				type: after.type,
				name: after.allNames,
				email: after.email,
				photo: after.photo
			},
			timestamp: after.signedUpAt
		})
		await UsersUseCases.updateUserWithRoles({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})
	},
	updated: async ({ before, after, changes }) => {
		if (changes.photo && before.photo) await publishers[EventTypes.DELETEFILE].publish(before.photo)

		const updatedBio = AuthUserEntity.bioKeys().some((key) => changes[key])
		if (updatedBio) await UsersUseCases.updateUserWithBio({
			id: after.id,
			data: {
				type: after.type,
				name: after.allNames,
				email: after.email,
				photo: after.photo
			},
			timestamp: Date.now()
		})

		const updatedRoles = changes.roles
		if (updatedRoles) await UsersUseCases.updateUserWithRoles({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})
	},
	deleted: async ({ before }) => {
		if (before.photo) await publishers[EventTypes.DELETEFILE].publish(before.photo)
	}
}