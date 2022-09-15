import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { TokenEntity, TokenFromModel } from '@modules/notifications'

export const TokenChangeStreamCallbacks: ChangeStreamCallbacks<TokenFromModel, TokenEntity> = {}