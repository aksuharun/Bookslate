import express from 'express'
import UserService from '../services/user-service.js' 

const router = express.Router()


// Get Methods
router.get('/add', (req, res) => {
	res.render('add-user')
})

router.get('/all', async (req, res) => {
	const users = await UserService.findAll()
	res.render('list', { items: users, itemType:'User' })
})

router.get('/:id', async (req, res) => {
	const user = await UserService.find(req.params.id)
	res.send(user)
})

router.get('/update/:id', (req, res) => {
	res.render('update-user', { id: req.params.id })
})

router.get('/delete', (req, res) => {	
	res.render('delete', { itemType: 'User' })
})

// Post, Update and Delete Methods
router.post('/add', async (req, res) => {
	const user = await UserService.add(req.body)
		.then(user => {
			console.log('User Added! User:', user)
			res.redirect(`./${user._id}`) // Redirect to the user we just created
		})
		.catch(console.log)
})

router.put('/update/:id', async (req, res) => {
	const user = await UserService.update(req.params.id, req.body)
		.then(user => {
			console.log('User Updated! User:', user)
			res.send(user)
		})
		.catch(err => console.log(err))
})

router.delete('/:id', async (req, res) => {
	const user = await UserService.del(req.params.id)
		.then(user => {
			console.log('User Deleted! User:', user)
			res.send(user)
		})
		.catch(err => console.log(err))
})

const userRouter = router
export default userRouter