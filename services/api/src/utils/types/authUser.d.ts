import { AuthUserType } from '@modules/auth'

declare module '@stranerd/api-commons/lib/utils/authUser' {
    interface AuthUser {
        email: string
        isEmailVerified: boolean
        type: AuthUserType
    }
}