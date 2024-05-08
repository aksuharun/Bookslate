import express from 'express'
import UserService from '../services/user-service.js'

const router = express.Router()

// Get Methods
router.get('/add', (req, res) => {
	res.render('add-user')
})

router.get('/all', async (req, res) => {
	await UserService.findAll()
		.then(users => {
			users.forEach(user => {
				user.password = '********' // Hide the password
			})
			res.render('list', { items: users, itemType:'User' })
		})
		.catch((err) => res.json(err))
})

router.get('/all/json', async (req, res) => {
	await UserService.findAll()
		.then(users =>{
			users.forEach(user => {
				user.password = '********' // Hide the password
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
			user.password = '********' // Hide the password
			res.render('data', { data: user })
		})
		.catch((err) => res.json(err))
})

router.get('/:id/json', async (req, res) => {
	await UserService.find(req.params.id)
		.then(user => {
			user.password = '********' // Hide the password
			res.json(user)
		})
		.catch((err) => res.json(err))
})

router.post('/add', async (req, res) => {
	await UserService.add(req.body)
		.then(user => {
			res.json(user) // Redirect to the user we just created
		})
		.catch((err) => {
			res.status(500).json(err)
		})
})

router.put('/update/:id', async (req, res) => {
	await UserService.update(req.params.id, req.body)
		.then(user => {
			res.json(user)
		})
		.catch(err => res.status(500).json(err))
})

router.delete('/:id', async (req, res) => {
	await UserService.del(req.params.id)
		.then(user => {
			res.json(user)
		})
		.catch(err =>{
			res.status(500).json(err)
		})
})

export default router