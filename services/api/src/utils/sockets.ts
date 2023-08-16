import { appInstance } from '@utils/environment'
import { checkPermissions } from '@utils/modules/auth'
import { AuthRole, OnJoinFn } from 'equipped'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel
	const canViewPayment: OnJoinFn = async ({ channel, user }) => checkPermissions(user, [
		AuthRole.canViewPayment
	]) ? channel : null
	const canViewReports: OnJoinFn = async ({ channel, user }) => checkPermissions(user, [
		AuthRole.canViewReports
	]) ? channel : null

	appInstance.listener.register('notifications/notifications', isMine)
		.register('payment/methods', isMine)
		.register('payment/transactions', isMine)
		.register('payment/wallets', isMine)
		.register('payment/payouts', canViewPayment)
		.register('users/users', isOpen)
		.register('users/orders', isMine)
		.register('sessions/sessions', isMine)
		.register('sessions/messages', isMine)
		.register('sessions/reviews', isOpen)
		.register('sessions/reports', canViewReports)
}