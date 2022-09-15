import { Credential, PasswordResetInput } from '../types'
import { AuthTypes } from '@stranerd/api-commons'
import { UserToModel } from '../../data/models/users'
import { AuthUserEntity } from '../entities/users'

export interface IAuthRepository {
	addNewUser (user: UserToModel, type: AuthTypes): Promise<AuthUserEntity>

	authenticateUser (details: Credential, passwordValidate: boolean, type: AuthTypes): Promise<AuthUserEntity>

	sendVerificationMail (email: string): Promise<boolean>

	verifyEmail (token: string): Promise<AuthUserEntity>

	sendPasswordResetMail (email: string): Promise<boolean>

	resetPassword (input: PasswordResetInput): Promise<AuthUserEntity>
}