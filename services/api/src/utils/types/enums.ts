import { makeEnum } from 'equipped'

const Ar = makeEnum('AuthRole', {
	isInactive: 'isInactive',
	isSuperAdmin: 'isSuperAdmin',
	canViewPatients: 'canViewPatients',
	canDeactivatePatientProfile: 'canDeactivatePatientProfile',
	canSendPatientNotification: 'canSendPatientNotification',
	canViewDoctors: 'canViewDoctors',
	canDeactivateDoctorProfile: 'canDeactivateDoctorProfile',
	canSendDoctorNotification: 'canSendDoctorNotification',
	canViewPayment: 'canViewPayment',
	canGeneratePayment: 'canGeneratePayment',
	canViewTransactionHistory: 'canViewTransactionHistory',
	canViewReports: 'canViewReports',
	canViewSessions: 'canViewSessions',
	canCreateAdmins: 'canCreateAdmins',
	canViewAdmins: 'canViewAdmins',
	canDeactivateAdminProfile: 'canDeactivateAdminProfile',
	canModifyRole: 'canModifyRole'
} as const)

const El = makeEnum('EmailsList', {
	NO_REPLY: 'no-reply@telespital.com', // TODO: get correct email address from Michael
	SUPPORT: 'support@telespital.com'
} as const)

const Ev = makeEnum('EventTypes', {
	SENDMAIL: 'SENDMAIL',
	SENDTEXT: 'SENDTEXT',
	DELETEFILE: 'DELETEFILE'
} as const)

declare module 'equipped/lib/enums/types' {
	type TAr = typeof Ar
	type TEl = typeof El
	type TEv = typeof Ev
	interface IAuthRole extends TAr { }
	interface IEmailsList extends TEl { }
	interface IEventTypes extends TEv { }
}