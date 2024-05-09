import express from 'express'
import UserService from '../services/user-service.js'
import LogService from '../services/log-service.js'
import {isAuthenticated, isAdmin, isSelfOrAdmin} from './middleware.js'

const router = express.Router()

// Get Methods
router.get('/add', (req, res) => {
	res.render('add-user')
})

router.get('/all', async (req, res) => {
	await UserService.findAll()
		.then(users => {
			users.forEach(user => {
				user.password = undefined
			})
			res.render('list', { items: users, itemType:'User' })
		})
		.catch((err) => res.json(err))
})

router.get('/all/json', async (req, res) => {
	await UserService.findAll()
		.then(users =>{
			users.forEach(user => {
				user.password = undefined
			})	
			res.json(users)
		})
		.catch((err) => res.json(err))
})

router.get('/update/:id', (req, res) => {
	res.render('update-user', { id: req.params.id })
})

router.get('/delete', (req, res) => {	
	res.render('delete', { itemType: 'User' })
})

router.get('/:id', async (req, res) => {
	await UserService.find(req.params.id)
		.then(user => {
			user.password = undefined
			res.render('data', { data: user })
		})
		.catch((err) => res.json(err))
})

router.get('/:id/json', async (req, res) => {
	await UserService.find(req.params.id)
		.then(user => {
			user.password = undefined
			res.json(user)
		})
		.catch((err) => res.json(err))
})

router.post('/add', isAdmin, async (req, res) => {
	await UserService.add(req.body)
		.then((user) => {
			LogService.add({
				userId: req._id,
				action: 'Add',
				refType: 'User',
				refId: user._id
			})
			res.json({ msg: 'User added' })
		})
		.catch((err) => res.status(500).json(err))
})

router.put('/update/:id', isSelfOrAdmin, async (req, res) => {
	await UserService.update(req.params.id, req.body)
		.then((user) => {
			LogService.add({
				userId: req._id,
				action: 'Update',
				refType: 'User',
				refId: user._id
			})
			res.json({ msg: 'User updated'})
		})
		.catch(err => res.status(500).json(err))
})

router.delete('/:id', isSelfOrAdmin, async (req, res) => {
	await UserService.del(req.params.id)
		.then(() => {
			LogService.add({
				userId: req._id,
				action: 'Delete',
				refType: 'User',
				refId: req.params.id
			})
			res.json({ msg: 'User deleted'})
		})
		.catch(err => res.status(500).json(err))
})

export default router