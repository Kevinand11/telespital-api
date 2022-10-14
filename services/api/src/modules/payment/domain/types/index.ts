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
	PayForSession = 'PayForSession',
	RefundSession = 'RefundSession'
}

export type TransactionData = {
	type: TransactionType.PayForSession,
	sessionId: string
} | {
	type: TransactionType.RefundSession,
	sessionId: string
}

export type AccountDetails = {
	country: CurrencyCountries
	number: string
	bankCode: string
	bankName: string
}