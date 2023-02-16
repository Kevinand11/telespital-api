import '@utils/types/enums'
import { EmailsList, getEnvOrFail, Instance } from 'equipped'

const useSSL = parseInt(getEnvOrFail('USE_SSL'))
export const baseDomain = `http${useSSL ? 's' : ''}://` + getEnvOrFail('BASE_DOMAIN')
export const environment = getEnvOrFail('ENVIRONMENT')
export const isDev = environment === 'local'
export const isProd = environment === 'production'

export const port = parseInt(getEnvOrFail('PORT'))
export const appId = getEnvOrFail('APP_ID')

export const superAdminEmail = getEnvOrFail('SUPER_ADMIN')

const mails = JSON.parse(getEnvOrFail('EMAILS') || '{}')
export const emails = Object.fromEntries(
	Object.entries(EmailsList).map(([key, value]) => [value, {
		privateKey: mails[key.toLowerCase()]?.private_key,
		clientId: mails[key.toLowerCase()]?.client_id
	}])
)

const braintree = JSON.parse(getEnvOrFail('BRAINTREE') || '{}')
export const braintreeConfig = {
	privateKey: braintree.privateKey,
	publicKey: braintree.publicKey,
	merchantId: braintree.merchantId,
	isProd: braintree.isProd
}

export const accessTokenKey = getEnvOrFail('ACCESS_TOKEN_KEY')
export const refreshTokenKey = getEnvOrFail('REFRESH_TOKEN_KEY')
export const mongoDbURI = getEnvOrFail('MONGODB_URI')
export const rabbitURI = getEnvOrFail('RABBITMQ_URI')
export const redisURI = getEnvOrFail('REDIS_URI')

Instance.initialize({
	accessTokenKey, refreshTokenKey,
	mongoDbURI, rabbitURI, redisURI,
	isDev, appId,
	bullQueueName: 'telespital-task-queues',
	rabbitColumnName: 'Telespital'
})
export const appInstance = Instance.get()

const agora = JSON.parse(getEnvOrFail('AGORA') || '{}')
export const agoraConfig = {
	appId: agora.appId,
	appCertificate: agora.appCertificate,
	apiKey: agora.apiKey,
	apiSecret: agora.apiSecret
}
