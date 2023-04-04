import { appInstance } from '@utils/environment'
import { NotAuthorizedError, QueryParams } from 'equipped'
import { ISessionRepository } from '../../domain/irepositories/sessions'
import { EmbeddedUser, SessionStatus } from '../../domain/types'
import { ReviewMapper } from '../mappers/reviews'
import { SessionMapper } from '../mappers/sessions'
import { ReviewToModel } from '../models/reviews'
import { SessionToModel } from '../models/sessions'
import { Review } from '../mongooseModels/reviews'
import { Session } from '../mongooseModels/sessions'

export class SessionRepository implements ISessionRepository {
	private static instance: SessionRepository
	private mapper: SessionMapper
	private reviewMapper: ReviewMapper

	private constructor () {
		this.mapper = new SessionMapper()
		this.reviewMapper = new ReviewMapper()
	}

	static getInstance () {
		if (!SessionRepository.instance) SessionRepository.instance = new SessionRepository()
		return SessionRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Session, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: SessionToModel) {
		const session = await Session.findOneAndUpdate({
			status: { $in: [SessionStatus.pendingPay, SessionStatus.waiting, SessionStatus.ongoing] },
			'patient.id': data.patient.id
		}, { $setOnInsert: data }, { new: true, upsert: true })
		return this.mapper.mapFrom(session)!
	}

	async find (id: string) {
		const session = await Session.findById(id)
		return this.mapper.mapFrom(session)
	}

	async connect (user: EmbeddedUser) {
		const session = await Session.findOneAndUpdate(
			{ status: SessionStatus.waiting, 'patient.id': { $ne: user.id } },
			{ $set: { doctor: user, status: SessionStatus.ongoing, startedAt: Date.now() } },
			{ new: true }
		)
		return this.mapper.mapFrom(session)
	}

	async update (id: string, userId: string, data: Partial<SessionToModel>, byDoctor: boolean) {
		const session = await Session.findOneAndUpdate(
			{ _id: id, [byDoctor ? 'doctor.id' : 'patient.id']: userId, closedAt: null },
			{ $set: data }, { new: true }
		)
		return this.mapper.mapFrom(session)
	}

	async updateUserBio (user: EmbeddedUser) {
		const result = await Promise.all([
			Session.updateMany({ 'patient.id': user.id }, { $set: { patient: user } }),
			Session.updateMany({ 'doctor.id': user.id }, { $set: { doctor: user } })
		])
		return result.every((r) => r.acknowledged)
	}

	async updatePaid (id: string, add: boolean) {
		const session = await Session.findByIdAndUpdate(id, {
			$set: { paid: add, ...(add ? { status: SessionStatus.waiting } : {}) }
		}, { new: true })
		return !!session
	}

	async close (id: string, userId: string) {
		const session = await Session.findOneAndUpdate(
			{ _id: id, closedAt: null, cancelled: null, 'doctor.id': userId, startedAt: { $ne: null } },
			{ $set: { closedAt: Date.now(), status: SessionStatus.pendingRating } },
			{ new: true })
		return !!session
	}

	async cancel (id: string, userId: string, reason: string) {
		const session = await Session.findOneAndUpdate(
			{ _id: id, closedAt: null, cancelled: null, 'patient.id': userId, startedAt: null },
			{
				$set: {
					cancelled: { userId, reason, at: Date.now() },
					closedAt: Date.now(),
					status: SessionStatus.completed
				}
			}, { new: true })
		return !!session
	}

	async rate (data: Omit<ReviewToModel, 'to'>) {
		let res = null as any
		await Session.collection.conn.transaction(async (session) => {
			const sessionToUpdate = this.mapper.mapFrom(await Session.findById(data.sessionId, {}, { session }))
			if (!sessionToUpdate || !sessionToUpdate.doctor || sessionToUpdate.closedAt === null || sessionToUpdate.cancelled !== null) throw new NotAuthorizedError('can\'t rate this session')
			if (sessionToUpdate.patient.id !== data.user.id) throw new NotAuthorizedError('can\'t rate this session')
			if (sessionToUpdate.ratings[data.user.id]) {
				res = await Review.findById(sessionToUpdate.ratings[data.user.id], { session })
				return res
			} else {
				const review = await new Review({ ...data, to: sessionToUpdate.doctor!.id }).save({ session })
				await Session.findByIdAndUpdate(data.sessionId,
					{ $set: { [`ratings.${data.user.id}`]: review.id, status: SessionStatus.completed } },
					{ session }
				)
				res = review
				return res
			}
		})
		return this.reviewMapper.mapFrom(res)!
	}
}
