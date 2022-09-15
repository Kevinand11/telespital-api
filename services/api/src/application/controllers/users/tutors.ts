import { UsersUseCases } from '@modules/users'
import { BadRequestError, Request, validate, Validation } from '@stranerd/api-commons'
import { SupportedAuthRoles } from '@utils/types'
import { SubjectsUseCases } from '@modules/questions'

export class TutorsController {
	static async saveTutors (req: Request) {
		const data = validate({
			tutorId: req.body.tutorId,
			add: req.body.add
		}, {
			tutorId: { required: true, rules: [Validation.isString] },
			add: { required: true, rules: [Validation.isBoolean] }
		})

		if (data.add) {
			const tutor = await UsersUseCases.find(data.tutorId)
			if (!tutor || !tutor.roles[SupportedAuthRoles.isTutor]) throw new BadRequestError('invalid tutorId')
		}

		const authUserId = req.authUser!.id
		return await UsersUseCases.updateUserTutors({ ...data, userId: authUserId })
	}

	static async saveSubjects (req: Request) {
		const data = validate({
			subjectId: req.body.subjectId,
			add: req.body.add
		}, {
			subjectId: { required: true, rules: [Validation.isString] },
			add: { required: true, rules: [Validation.isBoolean] }
		})

		if (data.add) {
			const subject = await SubjectsUseCases.find(data.subjectId)
			if (!subject) throw new BadRequestError('invalid subjectId')
		}

		const authUserId = req.authUser!.id
		return await UsersUseCases.updateTutorSubjects({ ...data, userId: authUserId })
	}
}