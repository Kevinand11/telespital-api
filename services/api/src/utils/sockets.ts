import { OnJoinFn } from '@stranerd/api-commons'
import { getSocketEmitter } from '@index'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel

	getSocketEmitter().register('notifications/notifications', isMine)
	getSocketEmitter().register('payment/cards', isMine)
	getSocketEmitter().register('payment/transactions', isMine)
	getSocketEmitter().register('payment/wallets', isMine)
	getSocketEmitter().register('users/users', isOpen)
	getSocketEmitter().register('consultations/consultations', isMine)
	getSocketEmitter().register('consultations/reviews', isOpen)
}