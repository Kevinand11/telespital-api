import { WalletDbChangeCallbacks } from '@utils/changeStreams/payment/wallets'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { WalletEntity } from '../../domain/entities/wallets'
import { Currencies } from '../../domain/types'
import { WalletMapper } from '../mappers/wallets'
import { WalletFromModel } from '../models/wallets'

const WalletSchema = new mongoose.Schema<WalletFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	balance: {
		amount: {
			type: Number,
			required: false,
			default: 0
		},
		currency: {
			type: String,
			required: false,
			default: Currencies.USD
		}
	},
	account: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: null
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Wallet = mongoose.model<WalletFromModel>('PaymentWallet', WalletSchema)

export const WalletChange = appInstance.db
	.generateDbChange<WalletFromModel, WalletEntity>(Wallet, WalletDbChangeCallbacks, new WalletMapper().mapFrom)