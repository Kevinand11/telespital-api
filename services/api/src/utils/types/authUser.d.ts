import { AuthUserType } from '@modules/auth'

declare module 'equipped/lib/utils/authUser' {
    interface AuthUser {
        email: string
        isEmailVerified: boolean
        type: AuthUserType
    }
}