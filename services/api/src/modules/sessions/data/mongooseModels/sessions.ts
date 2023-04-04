import { SessionDbChangeCallbacks } from '@utils/changeStreams/sessions/sessions'
import { appInstance } from '@utils/environment'
import { SessionMapper } from '../mappers/sessions'
import { SessionFromModel } from '../models/sessions'

const SessionSchema = new appInstance.dbs.mongo.Schema<SessionFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	doctor: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	patient: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false,
		default: ''
	},
	prescriptions: {
		type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as SessionFromModel['prescriptions'],
		required: false,
		default: []
	},
	note: {
		type: String,
		required: false,
		default: ''
	},
	price: {
		type: Number,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	paid: {
		type: Boolean,
		required: false,
		default: false
	},
	ratings: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {}
	},
	cancelled: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	startedAt: {
		type: Number,
		required: false,
		default: null
	},
	closedAt: {
		type: Number,
		required: false,
		default: null
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { minimize: false })

export const Session = appInstance.dbs.mongo.use().model<SessionFromModel>('Session', SessionSchema)

export const SessionChange = appInstance.dbs.mongo.change(Session, SessionDbChangeCallbacks, new SessionMapper().mapFrom)