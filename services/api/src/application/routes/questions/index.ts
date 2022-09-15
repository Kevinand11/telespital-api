import { answersRoutes } from './answers'
import { subjectsRoutes } from './subjects'
import { questionsRoutes } from './questions'

export default [
	...answersRoutes,
	...subjectsRoutes,
	...questionsRoutes
]