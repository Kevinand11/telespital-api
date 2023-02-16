import { ChangeStreamCallbacks } from 'equipped'
import { TokenEntity, TokenFromModel } from '@modules/notifications'

export const TokenChangeStreamCallbacks: ChangeStreamCallbacks<TokenFromModel, TokenEntity> = {}