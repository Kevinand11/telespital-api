import { ReportDbChangeCallbacks } from '@utils/changeStreams/sessions/reports'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { ReportEntity } from '../../domain/entities/reports'
import { ReportMapper } from '../mappers/reports'
import { ReportFromModel } from '../models/reports'

const ReportSchema = new mongoose.Schema<ReportFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	data: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	settlement: {
		type: mongoose.Schema.Types.Mixed,
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
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Report = mongoose.model<ReportFromModel>('SessionsReport', ReportSchema)

export const ReportChange = appInstance.db
	.generateDbChange<ReportFromModel, ReportEntity>(Report, ReportDbChangeCallbacks, new ReportMapper().mapFrom)