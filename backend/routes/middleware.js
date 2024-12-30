import jwt from 'jsonwebtoken'
import UserService from '../services/user-service.js'
import multer from 'multer'
import { UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError } from '../errors/api-errors.js'
import BaseError from '../errors/base-error.js'

function isAuthenticated (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		next(new UnauthorizedError('Token is missing'))
		return
	}

	jwt.verify(token, process.env.JWT_KEY_SECRET, (err, decoded) => {
		if (err) {
			next(new UnauthorizedError('Invalid token'))
			return
		}
		req.decoded = decoded
		next()
	})
}

function isAdmin (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		next(new UnauthorizedError('Token is missing'))
		return
	}
	
	jwt.verify(token, process.env.JWT_KEY_SECRET, async (err, decoded) => {
		try {
			if (err) {
				throw new UnauthorizedError('Invalid token')
			}
			
			const user = await UserService.find(decoded._id)
			if (!user) {
				throw new NotFoundError('User not found')
			}
			
			if (user.userRole !== 'admin') {
				console.warn('Non-admin user attempted to access admin route')
				throw new ForbiddenError('Admin access required')
			}
			
			req.decoded = decoded
			next()
		} catch (error) {
			if (error instanceof BaseError) {
				next(error)
				return
			}
			console.error('Admin authentication error:', error.message)
			next(new InternalServerError())
		}
	})
}

function isSelfOrAdmin (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		next(new UnauthorizedError('Token is missing'))
		return
	}

	jwt.verify(token, process.env.JWT_KEY_SECRET, async (err, decoded) => {
		try {
			if (err) {
				throw new UnauthorizedError('Invalid token')
			}

			const user = await UserService.find(decoded._id)
			if (!user) {
				throw new NotFoundError('User not found')
			}

			if (user.userRole !== 'admin' && user._id != req.params.id) {
				console.warn('Unauthorized access attempt to protected resource')
				throw new ForbiddenError('Access denied')
			}

			req.decoded = decoded
			next()
		} catch (error) {
			if (error instanceof BaseError) {
				next(error)
				return
			}
			console.error('Authentication error:', error.message)
			next(new InternalServerError())
		}
	})
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if(file.fieldname == 'coverImageFile')
			cb(null, 'books/covers/')
		else if(file.fieldname == 'bookFile')
			cb(null, 'books/epubs/')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		const ext = file.originalname.split('.')[1]
		const kebabCase = file.originalname.replace(/\s+/g, '-').toLowerCase().split('.').slice(0, -1)
		cb(null, kebabCase + '-' + uniqueSuffix + '.' + ext)
	}
})

const uploadHandler = multer({ storage: storage })

export { isAuthenticated, isAdmin, isSelfOrAdmin, uploadHandler }