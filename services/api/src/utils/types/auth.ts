export enum AuthRole {
	isInactive = 'isInactive',
	isSuperAdmin = 'isSuperAdmin',
	canViewPatients = 'canViewPatients',
	canDeactivatePatientProfile = 'canDeactivatePatientProfile',
	canSendPatientNotification = 'canSendPatientNotification',
	canViewDoctors = 'canViewDoctors',
	canDeactivateDoctorProfile = 'canDeactivateDoctorProfile',
	canSendDoctorNotification = 'canSendDoctorNotification',
	canViewFinance = 'canViewFinance',
	canGeneratePayment = 'canGeneratePayment',
	canViewTransactionHistory = 'canViewTransactionHistory',
	canViewReports = 'canViewReports',
	canViewSessions = 'canViewSessions',
	canViewAdmins = 'canViewAdmins',
	canModifyRole = 'canModifyRole'
}

export type AuthRoles = Partial<Record<AuthRole, boolean>>