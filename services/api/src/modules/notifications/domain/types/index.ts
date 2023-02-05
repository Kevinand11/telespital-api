export enum NotificationType {
	RoleUpdated = 'RoleUpdated',
	AdminMessage = 'AdminMessage',
	SystemMessage = 'SystemMessage',
}

export type NotificationData = { type: NotificationType.RoleUpdated }
	| { type: NotificationType.AdminMessage, adminId: string }
	| { type: NotificationType.SystemMessage }
