import { AuthRoles } from '@utils/types/auth'
import { AuthUserType } from '@modules/auth'

export {}

declare module '@stranerd/api-commons/lib/utils/authUser' {
	interface AuthUser {
		email: string
		roles: AuthRoles
		type: AuthUserType
		isEmailVerified: boolean
	}
}