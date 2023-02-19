import { SessionDbChangeCallbacks } from '@utils/changeStreams/sessions/sessions'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { SessionEntity } from '../../domain/entities/sessions'
import { SessionMapper } from '../mappers/sessions'
import { SessionFromModel } from '../models/sessions'

const SessionSchema = new mongoose.Schema<SessionFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	doctor: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: null
	},
	patient: {
		type: mongoose.Schema.Types.Mixed,
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
		type: [mongoose.Schema.Types.Mixed] as unknown as SessionFromModel['prescriptions'],
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
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: {}
	},
	cancelled: {
		type: mongoose.Schema.Types.Mixed,
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

export const Session = mongoose.model<SessionFromModel>('Session', SessionSchema)

export const SessionChange = appInstance.db
	.generateDbChange<SessionFromModel, SessionEntity>(Session, SessionDbChangeCallbacks, new SessionMapper().mapFrom)