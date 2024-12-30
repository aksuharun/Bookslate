import { ValidationError, NotFoundError, InternalServerError } from '../errors/api-errors.js'

const sanitizeError = (error, operation) => {
	// Remove sensitive fields from error object
	const sanitizedError = {
		operation,
		name: error.name,
		message: error.message
	}

	// Remove any potential sensitive data from error message
	if (error.message?.includes('password')) {
		sanitizedError.message = 'Validation error occurred'
	}

	return sanitizedError
}

const logError = (error, context) => {
	// Redact sensitive information
	const sanitizedContext = { ...context }
	delete sanitizedContext.password
	delete sanitizedContext.token
	
	// Log based on error type
	if (error instanceof ValidationError) {
		console.warn('Validation Error:', {
			...sanitizeError(error, context.operation),
			context: sanitizedContext
		})
	} else {
		console.error('Service Error:', {
			...sanitizeError(error, context.operation),
			context: sanitizedContext
		})
	}
}

class Service {
	async add(item) {
		try {
			if (!item) {
				throw new ValidationError('Item is required')
			}

			const result = await this.model.create(item)
			if (!result) {
				throw new InternalServerError('Failed to create item')
			}

			return result
		} catch (error) {
			logError(error, { operation: 'add', item })
			throw error
		}
	}
	
	async findAll() {
		try {
			const results = await this.model.find()
			return results
		} catch (error) {
			logError(error, { operation: 'findAll' })
			throw error
		}
	}

	async find(id) {
		try {
			if (!id) {
				throw new ValidationError('ID is required')
			}

			const result = await this.model.findById(id)
			if (!result) {
				throw new NotFoundError('Item not found')
			}

			return result
		} catch (error) {
			logError(error, { operation: 'find', id })
			throw error
		}
	}

	async findByField(field, limit) {
		try {
			if (!field) {
				throw new ValidationError('Search field is required')
			}

			const results = await this.model.find(field).limit(limit)
			return results
		} catch (error) {
			logError(error, { operation: 'findByField', field, limit })
			throw error
		}
	}

	async countByField(field) {
		try {
			if (!field) {
				throw new ValidationError('Field is required')
			}

			const count = await this.model.countDocuments(field)
			return count
		} catch (error) {
			logError(error, { operation: 'countByField', field })
			throw error
		}
	}

	async count() {
		try {
			const count = await this.model.countDocuments()
			return count
		} catch (error) {
			logError(error, { operation: 'count' })
			throw error
		}
	}
	
	async update(id, item) {
		try {
			if (!id) {
				throw new ValidationError('ID is required')
			}
			if (!item || Object.keys(item).length === 0) {
				throw new ValidationError('Update data is required')
			}

			const result = await this.model.findByIdAndUpdate(id, item, { new: true })
			if (!result) {
				throw new NotFoundError('Item not found')
			}

			return result
		} catch (error) {
			logError(error, { operation: 'update', id, item })
			throw error
		}
	}
	
	async del(id) {
		try {
			if (!id) {
				throw new ValidationError('ID is required')
			}

			const result = await this.model.findByIdAndDelete(id)
			if (!result) {
				throw new NotFoundError('Item not found')
			}

			return result
		} catch (error) {
			logError(error, { operation: 'delete', id })
			throw error
		}
	}
}

export default Service