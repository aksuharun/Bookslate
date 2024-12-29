import BaseError from './base-error.js'

const handleMongooseError = (err) => {
	if (err.name === 'ValidationError') {
		const messages = Object.values(err.errors).map(error => error.message)
		return {
			statusCode: 422,
			message: messages.join('. ')
		}
	}
	if (err.name === 'CastError') {
		return {
			statusCode: 400,
			message: 'Invalid ID format'
		}
	}
	if (err.code === 11000) {
		return {
			statusCode: 409,
			message: 'Duplicate field value entered'
		}
	}
	return null
}

const errorHandler = (err, req, res, next) => {
	if (err instanceof BaseError) {
		return res.status(err.statusCode).json({
			status: 'error',
			message: err.message
		})
	}

	const mongooseError = handleMongooseError(err)
	if (mongooseError) {
		return res.status(mongooseError.statusCode).json({
			status: 'error',
			message: mongooseError.message
		})
	}

	// Handle JWT Errors
	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			status: 'error',
			message: 'Invalid token'
		})
	}

	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			status: 'error',
			message: 'Token expired'
		})
	}

	// Default error
	console.error('Error:', err)
	res.status(500).json({
		status: 'error',
		message: 'Internal server error'
	})
}

export default errorHandler 