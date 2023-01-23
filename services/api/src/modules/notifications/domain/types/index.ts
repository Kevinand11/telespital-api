export enum NotificationType {
	RoleUpdated = 'RoleUpdated',
	AdminMessage = 'AdminMessage'
}

export type NotificationData = { type: NotificationType.RoleUpdated } |
	{ type: NotificationType.AdminMessage, adminId: string }
