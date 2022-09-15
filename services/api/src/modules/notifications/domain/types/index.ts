export enum NotificationType {
	NewAnswer = 'NewAnswer',
	RoleUpdated = 'RoleUpdated'
}

export type NotificationData = { type: NotificationType.NewAnswer, questionId: string, answerId: string }
	| { type: NotificationType.RoleUpdated }
