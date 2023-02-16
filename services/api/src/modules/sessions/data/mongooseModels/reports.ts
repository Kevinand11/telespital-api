import { generateChangeStreams, mongoose } from 'equipped'
import { ReportFromModel } from '../models/reports'
import { ReportChangeStreamCallbacks } from '@utils/changeStreams/sessions/reports'
import { ReportEntity } from '../../domain/entities/reports'
import { ReportMapper } from '../mappers/reports'

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

generateChangeStreams<ReportFromModel, ReportEntity>(Report, ReportChangeStreamCallbacks, new ReportMapper().mapFrom).then()