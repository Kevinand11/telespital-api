import { RtcRole, RtcTokenBuilder } from 'agora-token'
import { agoraConfig } from '@utils/environment'

const { appId, appCertificate, apiKey, apiSecret } = agoraConfig

/* const axiosInstance = axios.create({
	baseURL: 'https://api.100ms.live/v2'
}) */

export class LiveVideo {
	static async getRoomToken (data: { sessionId: string, userId: string, userName: string, isDoctor: boolean }) {
		const { sessionId, userName, userId, isDoctor } = data
		const roomId = await LiveVideo.createRoom(sessionId)
		const role = isDoctor ? RtcRole.PUBLISHER : RtcRole.PUBLISHER
		const authToken = RtcTokenBuilder.buildTokenWithUserAccount(
			appId, appCertificate, roomId, userId, role,
			3600 * 4, 3600 * 4
		)
		return { authToken, userName, userId, roomId, role, appId }
	}

	static async createRoom (sessionId: string) {
		return sessionId
	}

	static async endRoom (sessionId: string) {
		return !!sessionId
	}

	static async getSessions (sessionId: string) {
		const roomId = await LiveVideo.createRoom(sessionId)
		return roomId ? [] : []
		/* const { data } = await axiosInstance.get(`/sessions?room_id=${roomId}&limit=100`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': await LiveVideo.getManagementToken()
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
			const link = LiveVideo.parseS3URL(recording.location)
			const timestamp = new Date(recording.created_at).getTime()
			return {
				...res,
				recording: {
					link, timestamp,
					size: recording.size,
					duration: recording.duration
				}
			}
		}) */
	}

	static async getManagementToken () {
		return 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
	}

	static parseS3URL (url: string) {
		if (!url.startsWith('s3://')) return url
		const slices = url.slice(5).split('/')
		const bucket = slices[0]
		const name = slices.slice(1).join('/')
		return `https://s3.amazonaws.com/${bucket}/${name}`
	}
}