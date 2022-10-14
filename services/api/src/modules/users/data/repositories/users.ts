import { IUserRepository } from '../../domain/irepositories/users'
import { UserBio, UserMeta, UserRoles } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { User } from '../mongooseModels/users'
import { mongoose, parseQueryParams } from '@stranerd/api-commons'
import { UserFromModel } from '../models/users'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private mapper = new UserMapper()

	static getInstance (): UserRepository {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async get (query) {
		const data = await parseQueryParams<UserFromModel>(User, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async createUserWithBio (userId: string, data: UserBio, timestamp: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { bio: data },
			$setOnInsert: { _id: userId, dates: { createdAt: timestamp, deletedAt: null } }
		}, { upsert: true })
	}

	async updateUserWithBio (userId: string, data: UserBio, _: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { bio: data },
			$setOnInsert: { _id: userId }
		}, { upsert: true })
	}

	async find (userId: string) {
		const user = await User.findById(userId)
		return this.mapper.mapFrom(user)
	}

	async markUserAsDeleted (userId: string, timestamp: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { 'dates.deletedAt': timestamp }
		}, { upsert: true })
	}

	async updateUserWithRoles (userId: string, data: UserRoles) {
		await User.findByIdAndUpdate(userId, {
			$set: { roles: data }
		}, { upsert: true })
	}

	async updateUserStatus (userId: string, socketId: string, add: boolean) {
		const user = await User.findByIdAndUpdate(userId, {
			$set: { 'status.lastUpdatedAt': Date.now() },
			[add ? '$addToSet' : '$pull']: { 'status.connections': socketId }
		})
		return !!user
	}

	async resetAllUsersStatus () {
		const res = await User.updateMany({}, {
			$set: { 'status.connections': [] }
		})
		return !!res.acknowledged
	}

	async incrementUserMeta (userIds: string[], key: UserMeta, value: 1 | -1) {
		await User.updateMany({ id: { $in: userIds } }, {
			$inc: { [`meta.${key}`]: value }
		})
	}

	async updateRatings (userId: string, ratings: number, add: boolean) {
		let res = false
		const session = await mongoose.startSession()
		await session.withTransaction(async (session) => {
			const user = await User.findById(userId, {}, { session })
			if (!user) return res
			user.ratings.total += (add ? 1 : -1) * ratings
			user.ratings.count += add ? 1 : -1
			user.ratings.avg = Number((user.ratings.total / user.ratings.count).toFixed(2))
			res = !!(await user.save({ session }))
			return res
		})
		await session.endSession()
		return res
	}
}