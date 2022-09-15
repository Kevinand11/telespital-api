export enum SupportedAuthRoles {
	isAdmin = 'isAdmin',
	isSuperAdmin = 'isSuperAdmin',
}

export type AuthRoles = Partial<Record<SupportedAuthRoles, boolean>>