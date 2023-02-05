import { AuthOutput, AuthUserEntity, AuthUsersUseCases } from '@modules/auth'
import { NotificationType } from '@modules/notifications'
import {
	AuthUser,
	BadRequestError,
	Conditions,
	deleteCachedAccessToken,
	deleteCachedRefreshToken,
	exchangeOldForNewTokens,
	makeAccessToken,
	makeRefreshToken,
	NotAuthorizedError,
	Validation
} from '@stranerd/api-commons'
import { sendNotification } from '@utils/modules/notifications/notifications'
import { AuthRole } from '@utils/types'

const letters = 'abcdefghijklmnopqrstuvwxyz'
const lCaseLetters = letters.split('')
const uCaseLetters = letters.toUpperCase().split('')
const numbers = '0123456789'.split('')
const symbolChars = '~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/'
const symbols = symbolChars.split('')

export const isValidPassword = (value: string) => {
	const valids = [
		Validation.isString(value),
		Validation.isLongerThanOrEqualTo(value, 8),
		Validation.isShorterThanOrEqualTo(value, 40),
		uCaseLetters.some((l) => value.includes(l)) ? Validation.isValid() : Validation.isInvalid('must contain at least 1 uppercase letter'),
		lCaseLetters.some((l) => value.includes(l)) ? Validation.isValid() : Validation.isInvalid('must contain at least 1 lowercase letter'),
		numbers.some((l) => value.includes(l)) ? Validation.isValid() : Validation.isInvalid('must contain at least 1 number'),
		symbols.some((l) => value.includes(l)) ? Validation.isValid() : Validation.isInvalid(`must contain at least 1 special character in ${symbolChars}`)
	]
	if (valids.every((e) => e.valid)) return Validation.isValid()
	return Validation.isInvalid(valids.filter((v) => !v.valid)
		.map((v) => v.error)
		.join('\n'))
}

export const isValidPhone = (phone: { code: string, number: string }) => {
	const { code = '', number = '' } = phone ?? {}
	const isValidCode = Validation.isString(code).valid && code.startsWith('+') && Validation.isNumber(parseInt(code.slice(1))).valid
	const isValidNumber = Validation.isNumber(parseInt(number)).valid
	if (!isValidCode) return Validation.isInvalid('invalid phone code')
	if (!isValidNumber) return Validation.isInvalid('invalid phone number')
	return Validation.isValid()
}

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

export const checkPermissions = (authUser: AuthUser | null, roles: AuthRole[]) => {
	if (!authUser) throw new NotAuthorizedError('insufficient permissions')
	if (authUser.roles[AuthRole.isSuperAdmin]) return true
	if (authUser.roles[AuthRole.isInactive]) throw new NotAuthorizedError('your account is currently inactive')
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