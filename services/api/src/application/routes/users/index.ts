import { usersRoutes } from './users'
import { tutorsRoutes } from './tutors'
import { educationsRoutes } from './educations'
import { worksRoutes } from './works'

export default [
	...usersRoutes,
	...tutorsRoutes,
	...educationsRoutes,
	...worksRoutes
]