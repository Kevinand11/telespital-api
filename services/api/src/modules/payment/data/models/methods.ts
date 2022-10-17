import { MethodData } from '../../domain/types'

export interface MethodFromModel extends MethodToModel {
	_id: string
	primary: boolean
	createdAt: number
	updatedAt: number
}

export interface MethodToModel {
	userId: string
	token: string
	data: MethodData
}