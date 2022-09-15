import { getNewServerInstance } from '@stranerd/api-commons'
import { appId, appInstance, port } from '@utils/environment'
import { subscribers } from '@utils/events'
import { routes } from '@application/routes'
import { UsersUseCases } from '@modules/users'
import { startJobs } from '@utils/jobs'
import { registerSockets } from '@utils/sockets'

const app = getNewServerInstance(routes, {
	onConnect: async (userId, socketId) => {
		await UsersUseCases.updateUserStatus({ userId, socketId, add: true })
	},
	onDisconnect: async (userId, socketId) => {
		await UsersUseCases.updateUserStatus({ userId, socketId, add: false })
	}
})
export const getSocketEmitter = () => app.socketEmitter

const start = async () => {
	await appInstance.startDbConnection()
	await Promise.all(
		Object.values(subscribers)
			.map(async (subscriber) => {
				await subscriber.subscribe()
			})
	)

	await registerSockets()
	await UsersUseCases.resetAllUsersStatus()

	await app.start(port)
	await appInstance.logger.success(`${appId} service has started listening on port`, port)
	await startJobs()
}

start().then()