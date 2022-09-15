export enum Currencies {
	USD = 'USD'
}

export enum CurrencyCountries {
	US = 'US'
}

export enum TransactionStatus {
	initialized = 'initialized',
	fulfilled = 'fulfilled',
	failed = 'failed',
	settled = 'settled'
}

export enum TransactionType {
	NewCard = 'NewCard'
}

type TransactionNewCard = {
	type: TransactionType.NewCard
}

export type TransactionData = TransactionNewCard

export type AccountDetails = {
	country: CurrencyCountries
	number: string
	bankCode: string
	bankName: string
}