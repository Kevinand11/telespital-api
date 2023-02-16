import { CronTypes } from 'equipped'
import { appInstance } from '@utils/environment'
import { EmailsUseCases, NotificationsUseCases } from '@modules/notifications'
import { sendMailAndCatchError } from '@utils/modules/notifications/emails'
import { deleteUnverifiedUsers } from '@utils/modules/auth'
import { retryTransactions } from '@utils/modules/payment/transactions'
import { MethodsUseCases } from '@modules/payment'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues([
		{ name: CronTypes.hourly, cron: '0 * * * *' },
		{ name: CronTypes.daily, cron: '0 0 * * *' },
		{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
		{ name: CronTypes.monthly, cron: '0 0 1 * *' }
	], {
		onDelayed: async () => {
		},
		onCronLike: async () => {
		},
		onCron: async (type) => {
			if (type === CronTypes.hourly) {
				const errors = await EmailsUseCases.getAndDeleteAllErrors()
				await Promise.all(errors.map((e) => sendMailAndCatchError(e as any)))
				await retryTransactions(60 * 60 * 1000)
				await appInstance.job.retryAllFailedJobs()
			}
			if (type === CronTypes.daily) await deleteUnverifiedUsers()
			if (type === CronTypes.weekly) await NotificationsUseCases.deleteOldSeen()
			if (type === CronTypes.monthly) await MethodsUseCases.markExpireds()
		}
	})
}
