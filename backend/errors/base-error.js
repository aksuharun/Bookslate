class BaseError extends Error {
	constructor(message, statusCode, isOperational = true) {
		super(message)
		this.statusCode = statusCode
		this.isOperational = isOperational
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

export default BaseError 