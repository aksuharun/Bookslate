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
			res.render('list', { items: users, itemType:'User' })
		})
		.catch((err) => console.log(err))
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
			console.log('User:', user)
			res.render('data', { data: user })
		})
		.catch((err) => console.log(err))
})

// Post, Update and Delete Methods
router.post('/add', async (req, res) => {
	await UserService.add(req.body)
		.then(user => {
			console.log('User Added! User:', user)
			res.redirect(`./${user._id}`) // Redirect to the user we just created
		})
		.catch(console.log)
})

router.put('/update/:id', async (req, res) => {
	await UserService.update(req.params.id, req.body)
		.then(user => {
			console.log('User Updated! User:', user)
			res.send(user)
		})
		.catch(err => console.log(err))
})

router.delete('/:id', async (req, res) => {
	await UserService.del(req.params.id)
		.then(user => {
			console.log('User Deleted! User:', user)
			res.send(user)
		})
		.catch(err =>{
			console.log(err)
			res.status(500).send(err)
		})
})

const userRouter = router
export default userRouter