import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { ConsultationFromModel } from '../models/consultations'
import { ConsultationChangeStreamCallbacks } from '@utils/changeStreams/consultations/consultations'
import { ConsultationEntity } from '../../domain/entities/consultations'
import { ConsultationMapper } from '../mappers/consultations'

const ConsultationSchema = new mongoose.Schema<ConsultationFromModel>({
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
		type: [mongoose.Schema.Types.Mixed] as unknown as ConsultationFromModel['prescriptions'],
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

export const Consultation = mongoose.model<ConsultationFromModel>('Consultation', ConsultationSchema)

generateChangeStreams<ConsultationFromModel, ConsultationEntity>(Consultation, ConsultationChangeStreamCallbacks, new ConsultationMapper().mapFrom).then()