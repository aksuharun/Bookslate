import BaseService from './base-service.js';
import LogModel from '../models/log.js';

class LogService extends BaseService {
		model = LogModel
}

export default new LogService()