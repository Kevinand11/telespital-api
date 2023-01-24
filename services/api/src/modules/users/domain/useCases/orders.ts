import { IOrderRepository } from '../irepositories/orders'
import { QueryParams } from '@stranerd/api-commons'
import { OrderToModel } from '../../data/models/orders'

export class OrdersUseCase {
	repository: IOrderRepository

	constructor (repo: IOrderRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async add (data: OrderToModel) {
		return await this.repository.add(data)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async updatePaid ({ id, paid }: { id: string, paid: boolean }) {
		return this.repository.updatePaid(id, paid)
	}
}