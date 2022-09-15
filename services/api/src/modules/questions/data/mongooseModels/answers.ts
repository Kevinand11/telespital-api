import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { AnswerFromModel } from '../models/answers'
import { AnswerChangeStreamCallbacks } from '@utils/changeStreams/questions/answers'
import { AnswerEntity } from '../../domain/entities/answers'
import { AnswerMapper } from '../mappers/answers'

const Schema = new mongoose.Schema<AnswerFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	questionId: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.Mixed as unknown as AnswerFromModel['user'],
		required: true
	},
	attachment: {
		type: mongoose.Schema.Types.Mixed as unknown as AnswerFromModel['attachment'],
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
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Answer = mongoose.model<AnswerFromModel>('QuestionsAnswer', Schema)

generateChangeStreams<AnswerFromModel, AnswerEntity>(Answer, AnswerChangeStreamCallbacks, new AnswerMapper().mapFrom).then()

