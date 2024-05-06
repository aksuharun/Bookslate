import BaseService from './base-service.js'
import UserModel from '../models/user.js'

class UserService extends BaseService {
	model = UserModel
}

export default new UserService