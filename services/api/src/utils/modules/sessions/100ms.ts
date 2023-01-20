import jwt from 'jsonwebtoken'
import { Random } from '@stranerd/api-commons'
import { agoraConfig } from '@utils/environment'
import axios from 'axios'

const { appSecret, accessKey, templateId, region } = agoraConfig

const axiosInstance = axios.create({
	baseURL: 'https://api.100ms.live/v2'
})

export class Ms100Live {
	static async getRoomToken (data: { sessionId: string, userId: string, userName: string, isDoctor: boolean }) {
		const { sessionId, userName, userId, isDoctor } = data
		const roomId = await Ms100Live.createRoom(sessionId)
		const role = isDoctor ? 'session-doctor' : 'session-patient'
		const authToken = jwt.sign({
			access_key: accessKey,
			room_id: roomId,
			user_id: userId,
			role,
			type: 'app',
			version: 2,
			iat: Math.floor(Date.now() / 1000),
			nbf: Math.floor(Date.now() / 1000)
		}, appSecret, {
			algorithm: 'HS256',
			jwtid: Random.string(24)
		})
		return { authToken, userName, userId, roomId, role }
	}

	static async createRoom (sessionId: string) {
		const { data } = await axiosInstance.post('/rooms', {
			name: sessionId,
			description: 'Room Description',
			template_id: templateId,
			region
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer: ${await Ms100Live.getManagementToken()}`
			}
		})
		return data.id
	}

	static async endRoom (sessionId: string) {
		const roomId = await Ms100Live.createRoom(sessionId)
		const { data } = await axiosInstance.post(`/rooms/${roomId}`, {
			enabled: false
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer: ${await Ms100Live.getManagementToken()}`
			}
		})
		return data.enabled
	}

	static async getSessions (sessionId: string) {
		const roomId = await Ms100Live.createRoom(sessionId)
		const { data } = await axiosInstance.get(`/sessions?room_id=${roomId}&limit=100`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer: ${await Ms100Live.getManagementToken()}`
			}
		})
		return (data.data ?? []).reverse().map((session) => {
			const { recording } = session
			const res = {
				id: session.id,
				peers: Object.values(session.peers).map((p: any) => ({
					userId: p.user, role: p.role,
					joinedAt: new Date(p.joined_at).getTime(),
					leftAt: new Date(p.left_at).getTime()
				})),
				roomId: session.room_id,
				active: session.active,
				createdAt: new Date(session.created_at).getTime(),
				recording: null
			}
			if (!recording) return res
			const link = Ms100Live.parseS3URL(recording.location)
			const timestamp = new Date(recording.created_at).getTime()
			return {
				...res,
				recording: {
					link, timestamp,
					size: recording.size,
					duration: recording.duration
				}
			}
		})
	}

	private static async getManagementToken () {
		return jwt.sign({
			access_key: accessKey,
			type: 'management',
			version: 2,
			iat: Math.floor(Date.now() / 1000),
			nbf: Math.floor(Date.now() / 1000)
		}, appSecret, {
			algorithm: 'HS256',
			expiresIn: '24h',
			jwtid: Random.string(24)
		})
	}

	private static parseS3URL (url: string) {
		if (!url.startsWith('s3://')) return url
		const slices = url.slice(5).split('/')
		const bucket = slices[0]
		const name = slices.slice(1).join('/')
		return `https://s3.amazonaws.com/${bucket}/${name}`
	}
}