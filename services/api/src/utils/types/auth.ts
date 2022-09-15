export enum SupportedAuthRoles {
	isAdmin = 'isAdmin',
	isTutor = 'isTutor',
	isSuperAdmin = 'isSuperAdmin',
}

export type AuthRoles = Partial<Record<SupportedAuthRoles, boolean>>