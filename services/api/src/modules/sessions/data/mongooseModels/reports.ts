import { ReportDbChangeCallbacks } from '@utils/changeStreams/sessions/reports'
import { appInstance } from '@utils/environment'
import { ReportMapper } from '../mappers/reports'
import { ReportFromModel } from '../models/reports'

const ReportSchema = new appInstance.dbs.mongo.Schema<ReportFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
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
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	settlement: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
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

export const Report = appInstance.dbs.mongo.use().model<ReportFromModel>('SessionsReport', ReportSchema)

export const ReportChange = appInstance.dbs.mongo.change(Report, ReportDbChangeCallbacks, new ReportMapper().mapFrom)