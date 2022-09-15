import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { WalletFromModel } from '../models/wallets'
import { WalletChangeStreamCallbacks } from '@utils/changeStreams/payment/wallets'
import { WalletEntity } from '../../domain/entities/wallets'
import { WalletMapper } from '../mappers/wallets'
import { Currencies } from '../../domain/types'

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

generateChangeStreams<WalletFromModel, WalletEntity>(Wallet, WalletChangeStreamCallbacks, new WalletMapper().mapFrom).then()