import { UserDbChangeCallbacks } from '@utils/changeStreams/users/users'
import { appInstance } from '@utils/environment'
import { UserMeta } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'

const UserSchema = new appInstance.dbs.mongo.Schema<UserFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	bio: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	roles: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {} as unknown as UserFromModel['roles']
	},
	dates: {
		createdAt: {
			type: Number,
			required: false,
			default: Date.now
		},
		deletedAt: {
			type: Number,
			required: false,
			default: null
		}
	},
	meta: Object.fromEntries(
		Object.keys(UserMeta).map((key) => [key, {
			type: Number,
			required: false,
			default: 0
		}])
	),
	status: {
		connections: {
			type: [String],
			required: false,
			default: []
		},
		lastUpdatedAt: {
			type: Number,
			required: false,
			default: 0
		}
	},
	ratings: {
		count: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		},
		total: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		},
		avg: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		}
	}
}, { minimize: false })

export const User = appInstance.dbs.mongo.use().model<UserFromModel>('User', UserSchema)

export const UserChange = appInstance.dbs.mongo.change(User, UserDbChangeCallbacks, new UserMapper().mapFrom)