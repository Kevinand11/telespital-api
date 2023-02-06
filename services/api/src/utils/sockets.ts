import { getSocketEmitter } from '@index'
import { AuthRole, OnJoinFn } from '@stranerd/api-commons'
import { checkPermissions } from '@utils/modules/auth'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel
	const canViewPayment: OnJoinFn = async ({ channel, user }) => checkPermissions(user, [
		AuthRole.canViewPayment
	]) ? channel : null
	const canViewReports: OnJoinFn = async ({ channel, user }) => checkPermissions(user, [
		AuthRole.canViewReports
	]) ? channel : null

	getSocketEmitter().register('notifications/notifications', isMine)
	getSocketEmitter().register('payment/methods', isMine)
	getSocketEmitter().register('payment/transactions', isMine)
	getSocketEmitter().register('payment/wallets', isMine)
	getSocketEmitter().register('payment/payouts', canViewPayment)
	getSocketEmitter().register('users/users', isOpen)
	getSocketEmitter().register('users/orders', isMine)
	getSocketEmitter().register('sessions/sessions', isMine)
	getSocketEmitter().register('sessions/messages', isMine)
	getSocketEmitter().register('sessions/reviews', isOpen)
	getSocketEmitter().register('sessions/reports', canViewReports)
}