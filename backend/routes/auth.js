import express from 'express'
import jwt from 'jsonwebtoken'
import UserService from '../services/user-service.js'
import LogService from '../services/log-service.js'
import { BadRequestError, InternalServerError, ValidationError } from '../errors/api-errors.js'

const router = express.Router()

router.get('/signup', (req, res) => {
	res.render('signup')
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.post('/signup', async (req, res, next) => {
	try {
		if (!req.body.email || !req.body.password) {
			throw new ValidationError('Email and password are required')
		}

		const user = await UserService.add(req.body)
		await LogService.add({
			userId: user._id,
			action: 'Signup',
			refType: 'User',
			refId: user._id
		})
		res.json({ msg: 'User Added' })
	} catch (error) {
		next(error)
	}
})

router.post('/login', async (req, res, next) => {
	try {
		if (!req.body.email || !req.body.password) {
			throw new ValidationError('Email and password are required')
		}

		const _id = await UserService.login(req.body)
		const token = jwt.sign(
			{ _id }, 
			process.env.JWT_KEY_SECRET, 
			{ expiresIn: '1h' }
		)
		
		res.cookie('token', token, {
			httpOnly: true, 
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production'
		})
		
		await LogService.add({
			userId: _id,
			action: 'login',
			refType: 'User',
			refId: _id
		})
		
		res.json({ msg: 'Login Success' })
	} catch (error) {
		next(error)
	}
})

router.post('/logout', async (req, res, next) => {
	try {
		const baseUrl = req.protocol + '://' + req.get('host')
		res.clearCookie('token', {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production'
		})
		res.redirect(baseUrl)
	} catch (error) {
		next(error)
	}
})

export default router