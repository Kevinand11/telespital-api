import { QuestionsUseCases, SubjectsUseCases } from '@modules/questions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { StorageUseCases } from '@modules/storage'

export class QuestionController {
	static async FindQuestion (req: Request) {
		return await QuestionsUseCases.find(req.params.id)
	}

	static async GetQuestion (req: Request) {
		const query = req.query as QueryParams
		return await QuestionsUseCases.get(query)
	}

	static async UpdateQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedAttachment = req.files.attachment?.[0] ?? null
		const changedAttachment = !!uploadedAttachment || req.body.attachment === null

		const data = validate({
			body: req.body.body,
			attachment: uploadedAttachment as any
		}, {
			body: { required: true, rules: [Validation.isString, Validation.isExtractedHTMLLongerThanX(2)] },
			attachment: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})
		if (uploadedAttachment) data.attachment = await StorageUseCases.upload('questions/questions', uploadedAttachment)
		const validateData = {
			body: data.body,
			...(changedAttachment ? { attachment: data.attachment } : {})
		}

		const updatedQuestion = await QuestionsUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: validateData
		})

		if (updatedQuestion) return updatedQuestion
		throw new NotAuthorizedError()
	}

	static async CreateQuestion (req: Request) {
		const data = validate({
			body: req.body.body,
			subjectId: req.body.subjectId,
			topic: req.body.topic,
			attachment: req.files.attachment?.[0] ?? null
		}, {
			body: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			subjectId: { required: true, rules: [Validation.isString] },
			topic: { required: true, rules: [Validation.isString, Validation.isLongerThanX(2)] },
			attachment: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('user not found')
		const subject = await SubjectsUseCases.find(data.subjectId)
		if (!subject) throw new BadRequestError('subject not found')
		const attachment = data.attachment ? await StorageUseCases.upload('questions/questions', data.attachment) : null

		return await QuestionsUseCases.add({ ...data, attachment, user: user.getEmbedded() })
	}

	static async DeleteQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const isDeleted = await QuestionsUseCases.delete({ id: req.params.id, userId: authUserId })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async HoldQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const question = await QuestionsUseCases.hold({ id: req.params.id, userId: authUserId, hold: true })
		if (question) return question
		throw new NotAuthorizedError()
	}

	static async ReleaseQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const question = await QuestionsUseCases.hold({ id: req.params.id, userId: authUserId, hold: false })
		if (question) return question
		throw new NotAuthorizedError()
	}
}