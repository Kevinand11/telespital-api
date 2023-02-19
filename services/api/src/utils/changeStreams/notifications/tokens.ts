import { DbChangeCallbacks } from 'equipped'
import { TokenEntity, TokenFromModel } from '@modules/notifications'

export const TokenDbChangeCallbacks: DbChangeCallbacks<TokenFromModel, TokenEntity> = {}