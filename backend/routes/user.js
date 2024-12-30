import express from 'express'
import UserService from '../services/user-service.js'
import LogService from '../services/log-service.js'
import { isAuthenticated, isAdmin, isSelfOrAdmin } from './middleware.js'

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
		.catch((err) => {
			console.log(err)
			res.status(500).json({ msg: 'Error getting users' })
		})
})

router.get('/all/json', async (req, res) => {
	await UserService.findAll()
		.then(users =>{
			users.forEach(user => {
				user.password = undefined
			})	
			res.json(users)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).res.json({ msg: 'Error getting users' })
		})
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
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'User not found' })
		})
})

router.get('/:id/json', async (req, res) => {
	await UserService.find(req.params.id)
		.then(user => {
			user.password = undefined
			res.json(user)
		})
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'User not found' })
		})
})

// Post, Put, Delete Methods

router.post('/add', isAdmin, async (req, res) => {
	await UserService.add(req.body)
		.then((user) => {
			LogService.add({
				userId: req.decoded._id,
				action: 'Add',
				refType: 'User',
				refId: user._id
			})
			res.status(201).json({ msg: 'User added' })
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({ msg: 'Error adding user' })
		})
})

router.put('/update/:id', isSelfOrAdmin, async (req, res) => {
	await UserService.update(req.params.id, req.body)
		.then((user) => {
			LogService.add({
				userId: req.decoded._id,
				action: 'Update',
				refType: 'User',
				refId: user._id
			})
			res.json({ msg: 'User updated' })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ msg: 'Error updating user' })
		
		})
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
			res.json({ msg: 'User deleted' })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ msg: 'Error deleting user' })
		})
})

export default router