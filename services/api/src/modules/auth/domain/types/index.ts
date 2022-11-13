import { MediaOutput } from '@stranerd/api-commons'

export interface UserUpdateInput {
	name: { first: string, last: string }
	photo: MediaOutput | null
}

export interface RoleInput {
	userId: string
	roles: Record<string, boolean>
}

export type UserPhone = {
	code: string
	number: string
}

export interface RegisterInput extends UserUpdateInput {
	email: string;
	phone: UserPhone
	password: string
	type: AuthUserType
	data: AuthUserData
}

export interface PasswordResetInput {
	token: string;
	password: string;
}

export interface Credential {
	email: string;
	password: string;
}

export interface AuthOutput {
	accessToken: string;
	refreshToken: string;
}

export enum AuthUserType {
	patient = 'patient',
	doctor = 'doctor'
}

export type AuthUserData = Partial<{
	primarySpecialty: string
	secondarySpecialty: string
}>