import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { UserFromModel } from '../models/users'
import { UserChangeStreamCallbacks } from '@utils/changeStreams/users/users'
import { UserEntity } from '../../domain/entities/users'
import { UserMapper } from '../mappers/users'
import { UserMeta } from '../../domain/types'

const UserSchema = new mongoose.Schema<UserFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	bio: {
		type: mongoose.Schema.Types.Mixed as unknown as UserFromModel['bio'],
		required: true
	},
	roles: {
		type: mongoose.Schema.Types.Mixed as unknown as UserFromModel['roles'],
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
	}
}, { minimize: false })

export const User = mongoose.model<UserFromModel>('User', UserSchema)

generateChangeStreams<UserFromModel, UserEntity>(User, UserChangeStreamCallbacks, new UserMapper().mapFrom).then()