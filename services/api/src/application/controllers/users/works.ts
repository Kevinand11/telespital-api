import { WorksUseCases } from '@modules/users'
import { NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { StorageUseCases } from '@modules/storage'

export class WorkController {
	static async FindWork (req: Request) {
		return await WorksUseCases.find(req.params.id)
	}

	static async GetWorks (req: Request) {
		const query = req.query as QueryParams
		return await WorksUseCases.get(query)
	}

	static async UpdateWork (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedVerification = req.files.verification?.[0] ?? null
		const changedVerification = !!uploadedVerification || req.body.verification === null

		const data = validate({
			institution: req.body.institution,
			position: req.body.position,
			from: req.body.from,
			to: req.body.to,
			verification: uploadedVerification as any
		}, {
			institution: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			position: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			from: { required: true, rules: [Validation.isNumber] },
			to: { required: true, rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(req.body.from)] },
			verification: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})
		if (uploadedVerification) data.verification = await StorageUseCases.upload('users/works', uploadedVerification)
		const validateData = {
			institution: data.institution, position: data.position, from: data.from, to: data.to,
			...(changedVerification ? { verification: data.verification } : {})
		}

		const updatedWork = await WorksUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: validateData
		})

		if (updatedWork) return updatedWork
		throw new NotAuthorizedError()
	}

	static async CreateWork (req: Request) {
		const data = validate({
			institution: req.body.institution,
			position: req.body.position,
			from: req.body.from,
			to: req.body.to,
			verification: req.files.verification?.[0] ?? null
		}, {
			institution: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			position: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			from: { required: true, rules: [Validation.isNumber] },
			to: { required: true, rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(req.body.from)] },
			verification: { required: true, rules: [Validation.isNotTruncated, Validation.isFile] }
		})

		const authUserId = req.authUser!.id
		const verification = await StorageUseCases.upload('users/works', data.verification)
		return await WorksUseCases.add({ ...data, verification, userId: authUserId })
	}

	static async DeleteWork (req: Request) {
		const isDeleted = await WorksUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}