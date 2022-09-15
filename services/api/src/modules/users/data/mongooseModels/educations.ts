import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { EducationFromModel } from '../models/educations'
import { EducationChangeStreamCallbacks } from '@utils/changeStreams/users/educations'
import { EducationEntity } from '../../domain/entities/educations'
import { EducationMapper } from '../mappers/educations'

const EducationSchema = new mongoose.Schema<EducationFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	school: {
		type: String,
		required: true
	},
	degree: {
		type: String,
		required: true
	},
	from: {
		type: Number,
		required: true
	},
	to: {
		type: Number,
		required: true
	},
	verification: {
		type: mongoose.Schema.Types.Mixed,
		required: true
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

export const Education = mongoose.model<EducationFromModel>('UsersEducation', EducationSchema)

generateChangeStreams<EducationFromModel, EducationEntity>(Education, EducationChangeStreamCallbacks, new EducationMapper().mapFrom).then()