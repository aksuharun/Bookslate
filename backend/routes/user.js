import express from 'express'
import UserService from '../services/user-service.js'
import LogService from '../services/log-service.js'
import { isAuthenticated, isAdmin, isSelfOrAdmin } from './middleware.js'
import { NotFoundError, ValidationError, InternalServerError } from '../errors/api-errors.js'

const router = express.Router()

// Get Methods
router.get('/add', (req, res) => {
	res.render('add-user')
})

router.get('/all', async (req, res, next) => {
	try {
		const users = await UserService.findAll()
		users.forEach(user => {
			user.password = undefined
		})
		res.render('list', { items: users, itemType: 'User' })
	} catch (error) {
		next(error)
	}
})

router.get('/all/json', async (req, res, next) => {
	try {
		const users = await UserService.findAll()
		users.forEach(user => {
			user.password = undefined
		})
		res.json(users)
	} catch (error) {
		next(error)
	}
})

router.get('/update/:id', (req, res) => {
	res.render('update-user', { id: req.params.id })
})

router.get('/delete', (req, res) => {	
	res.render('delete', { itemType: 'User' })
})

router.get('/:id', async (req, res, next) => {
	try {
		const user = await UserService.find(req.params.id)
		if (!user) {
			throw new NotFoundError('User not found')
		}
		user.password = undefined
		res.render('data', { data: user })
	} catch (error) {
		next(error)
	}
})

router.get('/:id/json', async (req, res, next) => {
	try {
		const user = await UserService.find(req.params.id)
		if (!user) {
			throw new NotFoundError('User not found')
		}
		user.password = undefined
		res.json(user)
	} catch (error) {
		next(error)
	}
})

// Post, Put, Delete Methods
router.post('/add', isAdmin, async (req, res, next) => {
	try {
		if (!req.body.email || !req.body.password) {
			throw new ValidationError('Email and password are required')
		}

		const user = await UserService.add(req.body)
		await LogService.add({
			userId: req.decoded._id,
			action: 'Add',
			refType: 'User',
			refId: user._id
		})
		res.status(201).json({ msg: 'User added' })
	} catch (error) {
		next(error)
	}
})

router.put('/update/:id', isSelfOrAdmin, async (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new ValidationError('No update data provided')
		}

		const user = await UserService.update(req.params.id, req.body)
		if (!user) {
			throw new NotFoundError('User not found')
		}

		await LogService.add({
			userId: req.decoded._id,
			action: 'Update',
			refType: 'User',
			refId: user._id
		})
		res.json({ msg: 'User updated' })
	} catch (error) {
		next(error)
	}
})

router.delete('/:id', isSelfOrAdmin, async (req, res, next) => {
	try {
		const deleted = await UserService.del(req.params.id)
		if (!deleted) {
			throw new NotFoundError('User not found')
		}

		await LogService.add({
			userId: req.decoded._id,
			action: 'Delete',
			refType: 'User',
			refId: req.params.id
		})
		res.json({ msg: 'User deleted' })
	} catch (error) {
		next(error)
	}
})

export default router