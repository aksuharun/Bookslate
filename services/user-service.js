import BaseService from './base-service.js'
import UserModel from '../models/user.js'

class UserService extends BaseService {
	model = UserModel
	
	async login({ email, password }) {
		const user = await this.model.findOne({ email })
		if (!user) {
			throw new Error('The email does not exist')
		}
		if (user.password !== password) {
			throw new Error('Password incorrect')
		}
		return user._id
	}
}

export default new UserService