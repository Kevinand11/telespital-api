import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { QuestionsUseCases, SubjectEntity, SubjectFromModel } from '@modules/questions'
import { getSocketEmitter } from '@index'
import { UsersUseCases } from '@modules/users'

export const SubjectChangeStreamCallbacks: ChangeStreamCallbacks<SubjectFromModel, SubjectEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('questions/subjects', after)
		await getSocketEmitter().emitCreated(`questions/subjects/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('questions/subjects', after)
		await getSocketEmitter().emitUpdated(`questions/subjects/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('questions/subjects', before)
		await getSocketEmitter().emitDeleted(`questions/subjects/${before.id}`, before)
		await UsersUseCases.removeSavedSubjects(before.id)
		await QuestionsUseCases.deleteSubjectQuestions(before.id)
	}
}