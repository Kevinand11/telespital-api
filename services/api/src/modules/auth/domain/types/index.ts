import { MediaOutput } from '@stranerd/api-commons'

export interface UserUpdateInput {
	name: { first: string, last: string }
	photo: MediaOutput | null
}

export interface RoleInput {
	userId: string
	roles: Record<string, boolean>
}

export interface RegisterInput extends UserUpdateInput {
	email: string;
	password: string;
	type: AuthUserType
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

export type AuthUserData = { type: AuthUserType.patient }
	| { type: AuthUserType.doctor, primarySpecialty: string, secondarySpecialty: string }