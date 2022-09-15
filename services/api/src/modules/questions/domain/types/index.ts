export { EmbeddedUser } from '@modules/users'

import { MediaOutput } from '@stranerd/api-commons'

export type Media = MediaOutput

export type QuestionHeld = {
	userId: string
	heldAt: number
	releasedAt: number
} | null

export const MAX_ANSWERS_COUNT = 1