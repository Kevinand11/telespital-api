export enum AuthRole {
	isAdmin = 'isAdmin',
	isDoctor = 'isDoctor',
	isSuperAdmin = 'isSuperAdmin',
}

export type AuthRoles = Partial<Record<AuthRole, boolean>>