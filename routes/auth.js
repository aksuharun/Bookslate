import express from 'express'
import jwt from 'jsonwebtoken'
import UserService from '../services/user-service.js'
import LogService from '../services/log-service.js'

const router = express.Router()

router.post('/login', async (req, res) => {
	res.clearCookie('token')
	await UserService.login(req.body)
		.then(_id => {
			const token = jwt.sign(
				{ _id }, 
				process.env.JWT_KEY_SECRET, 
				{ expiresIn: 60 } // Update the expiration time when the development is done
			)
			res.cookie('token', token, {
					httpOnly: true, 
					sameSite: 'strict'
			})
			LogService.add({
				userId: _id,
				action: 'login',
				refType: 'User',
				refId: _id
			})
			res.json({ msg: 'Logic Success' })
		})
		.catch(err => res.status(500).json({ err: err.message }))
})

router.post('/logout', (req, res) => {
	const baseUrl = req.protocol + '://' + req.get('host')
	res.clearCookie('token')
	res.redirect(baseUrl)
})

export default router