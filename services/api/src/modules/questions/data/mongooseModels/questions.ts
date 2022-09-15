import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { QuestionFromModel } from '../models/questions'
import { QuestionChangeStreamCallbacks } from '@utils/changeStreams/questions/questions'
import { QuestionEntity } from '../../domain/entities/questions'
import { QuestionMapper } from '../mappers/questions'

const Schema = new mongoose.Schema<QuestionFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	body: {
		type: String,
		required: true
	},
	subjectId: {
		type: String,
		required: true
	},
	topic: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.Mixed as unknown as QuestionFromModel['user'],
		required: true
	},
	answers: {
		type: [Object as unknown as any],
		required: false,
		default: []
	},
	attachment: {
		type: mongoose.Schema.Types.Mixed as unknown as QuestionFromModel['attachment'],
		required: false,
		default: null
	},
	heldBy: {
		type: mongoose.Schema.Types.Mixed as unknown as QuestionFromModel['heldBy'],
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

export const Question = mongoose.model<QuestionFromModel>('Question', Schema)

generateChangeStreams<QuestionFromModel, QuestionEntity>(Question, QuestionChangeStreamCallbacks, new QuestionMapper().mapFrom).then()