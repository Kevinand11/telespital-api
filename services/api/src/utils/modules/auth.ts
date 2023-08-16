import { AuthOutput, AuthUserEntity, AuthUsersUseCases } from '@modules/auth'
import { NotificationType } from '@modules/notifications'
import {
	AuthRole,
	AuthUser,
	BadRequestError,
	Conditions,
	deleteCachedAccessToken,
	deleteCachedRefreshToken,
	Enum,
	exchangeOldForNewTokens,
	makeAccessToken,
	makeRefreshToken,
	NotAuthorizedError,
	Schema,
	Validation
} from 'equipped'
import { sendNotification } from '@utils/modules/notifications/notifications'

const letters = 'abcdefghijklmnopqrstuvwxyz'
const lCaseLetters = letters.split('')
const uCaseLetters = letters.toUpperCase().split('')
const numbers = '0123456789'.split('')
const symbolChars = '~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/'
const symbols = symbolChars.split('')

export const isValidPassword = Validation.makeRule<string>((value) => Schema
	.string().min(8).max(40)
	.custom((v) => uCaseLetters.some((l) => v?.includes(l)), 'must contain at least 1 uppercase letter')
	.custom((v) => lCaseLetters.some((l) => v?.includes(l)), 'must contain at least 1 lowercase letter')
	.custom((v) => numbers.some((l) => v?.includes(l)), 'must contain at least 1 number')
	.custom((v) => symbols.some((l) => v?.includes(l)), `must contain at least 1 special character in ${symbolChars}`)
	.parse(value))

export const signOutUser = async (userId: string): Promise<boolean> => {
	await deleteCachedAccessToken(userId)
	await deleteCachedRefreshToken(userId)
	return true
}

export const generateAuthOutput = async (user: AuthUserEntity): Promise<AuthOutput & { user: AuthUserEntity }> => {
	const accessToken = await makeAccessToken({
		id: user.id,
		email: user.email,
		type: user.type,
		roles: user.roles,
		isEmailVerified: user.isVerified
	})
	const refreshToken = await makeRefreshToken({ id: user.id })
	return { accessToken, refreshToken, user }
}

export const getNewTokens = async (tokens: AuthOutput): Promise<AuthOutput & { user: AuthUserEntity }> => {
	let user = null as null | AuthUserEntity
	const newTokens = await exchangeOldForNewTokens(tokens, async (id: string) => {
		user = await AuthUsersUseCases.findUser(id)
		if (!user) throw new BadRequestError('No account with such id exists')
		const { accessToken, refreshToken } = await generateAuthOutput(user)
		return { accessToken, refreshToken }
	})

	return { ...newTokens, user: user! }
}

export const deleteUnverifiedUsers = async () => {
	const sevenDays = 7 * 24 * 60 * 60 * 1000
	const { results: unverifiedUsers } = await AuthUsersUseCases.getUsers({
		where: [
			{ field: 'isVerified', value: false },
			{ field: 'signedUpAt', condition: Conditions.lte, value: Date.now() - sevenDays }
		],
		all: true
	})
	await AuthUsersUseCases.deleteUsers(unverifiedUsers.map((u) => u.id))
}

export const checkPermissions = (authUser: AuthUser | null, roles: Enum<typeof AuthRole>[]) => {
	if (!authUser) throw new NotAuthorizedError('insufficient permissions')
	if (authUser.roles[AuthRole.isSuperAdmin]) return true
	const hasPerm = roles.some((role) => authUser.roles[role])
	if (!hasPerm) throw new NotAuthorizedError('insufficient permissions')
	return true
}

export const deActivateUserProfile = async (userId: string, value: boolean, message: string) => {
	await sendNotification([userId], {
		title: 'Profile Activity Updated',
		body: message, sendEmail: true,
		data: { type: NotificationType.SystemMessage }
	})
	return await AuthUsersUseCases.updateRole({
		userId, roles: { [AuthRole.isInactive]: value }
	})
}