import { IUserRepository } from '../irepositories/users'
import { UserBio, UserMeta, UserRoles } from '../types'
import { QueryParams } from '@stranerd/api-commons'

export class UsersUseCase {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async createUserWithBio (params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.createUserWithBio(params.id, params.data, params.timestamp)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async markUserAsDeleted (params: { id: string, timestamp: number }) {
		return await this.repository.markUserAsDeleted(params.id, params.timestamp)
	}

	async resetAllUsersStatus () {
		return await this.repository.resetAllUsersStatus()
	}

	async updateUserStatus (input: { userId: string, socketId: string, add: boolean }) {
		return await this.repository.updateUserStatus(input.userId, input.socketId, input.add)
	}

	async updateUserWithBio (params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.updateUserWithBio(params.id, params.data, params.timestamp)
	}

	async updateUserWithRoles (params: { id: string, data: UserRoles, timestamp: number }) {
		return await this.repository.updateUserWithRoles(params.id, params.data, params.timestamp)
	}

	async incrementMeta (params: { ids: string[], value: number, property: UserMeta }) {
		return await this.repository.incrementUserMeta(params.ids, params.property, params.value)
	}

	async updateRatings (input: { userId: string, ratings: number, add: boolean }) {
		return await this.repository.updateRatings(input.userId, input.ratings, input.add)
	}
}