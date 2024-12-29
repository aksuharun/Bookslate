import BaseService from './base-service.js'
import BookModel from '../models/book.js'

class BookService extends BaseService {
	model = BookModel
}
export default new BookService()