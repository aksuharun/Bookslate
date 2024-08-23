import express from 'express'
import jwt from 'jsonwebtoken'
import UserService from '../services/user-service.js'
import LogService from '../services/log-service.js'

const router = express.Router()

router.get('/signup', (req, res) => {
	res.render('signup')
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.post('/signup', async (req, res) => {
	await UserService.add(req.body)
		.then(async user => {
			await LogService.add({
				userId: user._id,
				action: 'Signup',
				refType: 'User',
				refId: user._id
			})
			res.json({ msg: 'User Added' })
		})
		.catch(err => {
			console.log(err)	
			res.status(500).json({ err: err.message })
		})
})

router.post('/login', async (req, res) => {
	await UserService.login(req.body)
		.then(async _id => {
			const token = jwt.sign(
				{ _id }, 
				process.env.JWT_KEY_SECRET, 
				{ expiresIn: '1h' }
			)
			res.cookie('token', token, {
					httpOnly: true, 
					sameSite: 'strict'
			})
			await LogService.add({
				userId: _id,
				action: 'login',
				refType: 'User',
				refId: _id
			})
			res.json({ msg: 'Logic Success' })
		})
		.catch(err =>{
			res.status(500).json({ err: err.message })
	})
})

router.post('/logout', (req, res) => {
	const baseUrl = req.protocol + '://' + req.get('host')
	res.clearCookie('token')
	res.redirect(baseUrl)
})

export default router