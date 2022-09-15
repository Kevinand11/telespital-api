import { Media } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class EducationEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly school: string
	public readonly degree: string
	public readonly from: number
	public readonly to: number
	public readonly verification: Media
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, userId, school, degree, from, to,
		             verification, createdAt, updatedAt
	             }: EducationConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.school = school
		this.degree = degree
		this.from = from
		this.to = to
		this.verification = verification
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type EducationConstructorArgs = {
	id: string
	userId: string
	school: string
	degree: string
	from: number
	to: number
	verification: Media
	createdAt: number
	updatedAt: number
}