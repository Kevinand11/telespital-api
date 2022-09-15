import { AnswersUseCases, QuestionsUseCases } from '@modules/questions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { StorageUseCases } from '@modules/storage'

export class AnswerController {
	static async FindAnswer (req: Request) {
		return await AnswersUseCases.find(req.params.id)
	}

	static async GetAnswers (req: Request) {
		const query = req.query as QueryParams
		return await AnswersUseCases.get(query)
	}

	static async UpdateAnswer (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedAttachment = req.files.attachment?.[0] ?? null
		const changedAttachment = !!uploadedAttachment || req.body.attachment === null

		const data = validate({
			attachment: uploadedAttachment as any
		}, {
			attachment: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})
		if (uploadedAttachment) data.attachment = await StorageUseCases.upload('questions/answers', uploadedAttachment)
		const validateData = {
			...(changedAttachment ? { attachment: data.attachment } : {})
		}

		const updatedAnswer = await AnswersUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: validateData
		})

		if (updatedAnswer) return updatedAnswer
		throw new NotAuthorizedError()
	}

	static async CreateAnswer (req: Request) {
		const data = validate({
			questionId: req.body.questionId,
			attachment: req.files.attachment?.[0] ?? null
		}, {
			questionId: { required: true, rules: [Validation.isString] },
			attachment: { required: true, rules: [Validation.isNotTruncated, Validation.isVideo] }
		})

		const authUserId = req.authUser!.id
		const question = await QuestionsUseCases.find(data.questionId)
		if (!question) throw new BadRequestError('question not found')
		if (question.isAnswered()) throw new BadRequestError('question already answered')
		if (!question.isHeldBy(authUserId)) throw new BadRequestError('you can\'t answer a question you are not holding')
		const user = await UsersUseCases.find(authUserId)
		if (!user) throw new BadRequestError('user not found')
		const attachment = await StorageUseCases.upload('questions/answers', data.attachment)
		return await AnswersUseCases.add({ ...data, attachment, user: user.getEmbedded() })
	}

	static async DeleteAnswer (req: Request) {
		const isDeleted = await AnswersUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}