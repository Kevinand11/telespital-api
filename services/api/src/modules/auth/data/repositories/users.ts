import { appInstance } from '@utils/environment'
import {
	AuthTypes,
	deleteCachedAccessToken,
	Hash,
	NotFoundError, QueryParams
} from 'equipped'
import { IUserRepository } from '../../domain/irepositories/users'
import { RegisterInput, RoleInput, UserUpdateInput } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { User } from '../mongooseModels/users'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private mapper: UserMapper

	private constructor () {
		this.mapper = new UserMapper()
	}

	static getInstance (): UserRepository {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async findUser (id: string) {
		const user = await User.findById(id)
		return this.mapper.mapFrom(user)
	}

	async getUsers (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(User, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async deleteUsers (userIds: string[]) {
		await User.deleteMany({ _id: { $in: userIds } })
	}

	async updateUserProfile (userId: string, data: UserUpdateInput) {
		const user = await User.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(user)!
	}

	async updateDetails (userId: string, details: RegisterInput) {
		const user = await User.findByIdAndUpdate(
			userId,
			{
				$set: {
					...details,
					password: await Hash.hash(details.password),
					lastSignedInAt: Date.now()
				},
				$addToSet: {
					authTypes: AuthTypes.email
				}
			},
			{ new: true }
		)
		if (!user) throw new NotFoundError()

		return this.mapper.mapFrom(user)!

	}

	async updateUserRole ({ userId, roles }: RoleInput) {
		const set = Object.fromEntries(Object.entries(roles).filter((role) => role[1]).map((role) => [`roles.${role[0]}`, role[1]]))
		const unset = Object.fromEntries(Object.entries(roles).filter((role) => !role[1]).map((role) => [`roles.${role[0]}`, role[1]]))
		const user = await User.findByIdAndUpdate(userId, {
			$set: set, $unset: unset
		})
		// clear accessToken
		await deleteCachedAccessToken(userId)
		return !!user
	}

	async updatePassword (userId: string, password: string) {
		const user = await User.findByIdAndUpdate(userId, {
			$set: { password: await Hash.hash(password) },
			$addToSet: { authTypes: AuthTypes.email }
		})
		return !!user
	}
}