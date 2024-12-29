import BaseError from './base-error.js'

export class BadRequestError extends BaseError {
	constructor(message = 'Bad Request') {
		super(message, 400)
	}
}

export class UnauthorizedError extends BaseError {
	constructor(message = 'Unauthorized') {
		super(message, 401)
	}
}

export class ForbiddenError extends BaseError {
	constructor(message = 'Forbidden') {
		super(message, 403)
	}
}

export class NotFoundError extends BaseError {
	constructor(message = 'Resource Not Found') {
		super(message, 404)
	}
}

export class ConflictError extends BaseError {
	constructor(message = 'Resource Conflict') {
		super(message, 409)
	}
}

export class ValidationError extends BaseError {
	constructor(message = 'Validation Error') {
		super(message, 422)
	}
}

export class InternalServerError extends BaseError {
	constructor(message = 'Internal Server Error') {
		super(message, 500, false)
	}
} 