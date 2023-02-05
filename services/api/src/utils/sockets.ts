import { checkPermissions } from '@utils/modules/auth'
import { OnJoinFn } from '@stranerd/api-commons'
import { getSocketEmitter } from '@index'
import { AuthRole } from '@utils/types'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel
	const canViewFinance: OnJoinFn = async ({ channel, user }) => checkPermissions(user, [
		AuthRole.canViewFinance
	]) ? channel : null

	getSocketEmitter().register('notifications/notifications', isMine)
	getSocketEmitter().register('payment/methods', isMine)
	getSocketEmitter().register('payment/transactions', isMine)
	getSocketEmitter().register('payment/wallets', isMine)
	getSocketEmitter().register('payment/payouts', canViewFinance)
	getSocketEmitter().register('users/users', isOpen)
	getSocketEmitter().register('users/orders', isMine)
	getSocketEmitter().register('sessions/sessions', isMine)
	getSocketEmitter().register('sessions/messages', isMine)
	getSocketEmitter().register('sessions/reviews', isOpen)
}