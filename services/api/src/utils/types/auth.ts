export enum AuthRole {
	isInactive = 'isInactive',
	isAdmin = 'isAdmin',
	isSuperAdmin = 'isSuperAdmin',
}

export type AuthRoles = Partial<Record<AuthRole, boolean>>