import { EducationsUseCases } from '@modules/users'
import { NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { StorageUseCases } from '@modules/storage'

export class EducationController {
	static async FindEducation (req: Request) {
		return await EducationsUseCases.find(req.params.id)
	}

	static async GetEducations (req: Request) {
		const query = req.query as QueryParams
		return await EducationsUseCases.get(query)
	}

	static async UpdateEducation (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedVerification = req.files.verification?.[0] ?? null
		const changedVerification = !!uploadedVerification || req.body.verification === null

		const data = validate({
			school: req.body.school,
			degree: req.body.degree,
			from: req.body.from,
			to: req.body.to,
			verification: uploadedVerification as any
		}, {
			school: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			degree: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			from: { required: true, rules: [Validation.isNumber] },
			to: { required: true, rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(req.body.from)] },
			verification: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})
		if (uploadedVerification) data.verification = await StorageUseCases.upload('users/educations', uploadedVerification)
		const validateData = {
			school: data.school, degree: data.degree, from: data.from, to: data.to,
			...(changedVerification ? { verification: data.verification } : {})
		}

		const updatedEducation = await EducationsUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: validateData
		})

		if (updatedEducation) return updatedEducation
		throw new NotAuthorizedError()
	}

	static async CreateEducation (req: Request) {
		const data = validate({
			school: req.body.school,
			degree: req.body.degree,
			from: req.body.from,
			to: req.body.to,
			verification: req.files.verification?.[0] ?? null
		}, {
			school: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			degree: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			from: { required: true, rules: [Validation.isNumber] },
			to: { required: true, rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(req.body.from)] },
			verification: { required: true, rules: [Validation.isNotTruncated, Validation.isFile] }
		})

		const authUserId = req.authUser!.id
		const verification = await StorageUseCases.upload('users/educations', data.verification)
		return await EducationsUseCases.add({ ...data, verification, userId: authUserId })
	}

	static async DeleteEducation (req: Request) {
		const isDeleted = await EducationsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}