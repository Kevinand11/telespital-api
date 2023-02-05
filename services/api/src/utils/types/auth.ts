export enum AuthRole {
	isInactive = 'isInactive',
	isSuperAdmin = 'isSuperAdmin',
	canViewPatients = 'canViewPatients',
	canDeactivatePatientProfile = 'canDeactivatePatientProfile',
	canSendPatientNotification = 'canSendPatientNotification',
	canViewDoctors = 'canViewDoctors',
	canDeactivateDoctorProfile = 'canDeactivateDoctorProfile',
	canSendDoctorNotification = 'canSendDoctorNotification',
	canViewPayment = 'canViewPayment',
	canGeneratePayment = 'canGeneratePayment',
	canViewTransactionHistory = 'canViewTransactionHistory',
	canViewReports = 'canViewReports',
	canViewSessions = 'canViewSessions',
	canCreateAdmins = 'canCreateAdmins',
	canViewAdmins = 'canViewAdmins',
	canDeactivateAdminProfile = 'canDeactivateAdminProfile',
	canModifyRole = 'canModifyRole'
}

export type AuthRoles = Partial<Record<AuthRole, boolean>>