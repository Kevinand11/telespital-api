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
	appInstance.listener.register('payment/methods', isMine)
	appInstance.listener.register('payment/transactions', isMine)
	appInstance.listener.register('payment/wallets', isMine)
	appInstance.listener.register('payment/payouts', canViewPayment)
	appInstance.listener.register('users/users', isOpen)
	appInstance.listener.register('users/orders', isMine)
	appInstance.listener.register('sessions/sessions', isMine)
	appInstance.listener.register('sessions/messages', isMine)
	appInstance.listener.register('sessions/reviews', isOpen)
	appInstance.listener.register('sessions/reports', canViewReports)
}