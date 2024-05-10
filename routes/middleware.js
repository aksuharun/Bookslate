import jwt from 'jsonwebtoken'
import UserService from '../services/user-service.js'

function isAuthenticated (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		return res.status(401).json({ msg: 'Token is missing' })
	}

	jwt.verify(token, process.env.JWT_KEY_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ msg: 'Unauthorized' })
		}
		req.decoded = decoded
		next()
	})
}

function isAdmin (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		return res.status(401).json({ msg: 'Token is missing' })
	}

	jwt.verify(token, process.env.JWT_KEY_SECRET, async (err, decoded) => {
		if (err) {
			return res.status(401).json({ msg: 'Unauthorized' })
		}
		const user = await UserService.find(decoded._id)
		if (user.userRole != 'admin') {
			console.log(user)
			return res.status(403).json({ msg: 'Forbidden' })
		}
		req.decoded = decoded
		next()
	})
}

function isSelfOrAdmin (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		return res.status(401).json({ msg: 'Token is missing' })
	}

	jwt.verify(token, process.env.JWT_KEY_SECRET, async (err, decoded) => {
		if (err) {
			return res.status(401).json({ msg: 'Unauthorized' })
		}
		const user = await UserService.find(decoded._id)
		if (user.userRole != 'admin' && user._id != req.body._id) {
			return res.status(403).json({ msg: 'Forbidden' })
		}
		req.decoded = decoded
		next()
	})
}

export { isAuthenticated, isAdmin, isSelfOrAdmin }