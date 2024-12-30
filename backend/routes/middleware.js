import jwt from 'jsonwebtoken'
import UserService from '../services/user-service.js'
import multer from 'multer'

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
		try {
			if (err) {
				return res.status(401).json({ msg: 'Unauthorized' })
			}
			
			const user = await UserService.find(decoded._id)
			if (!user) {
				return res.status(404).json({ msg: 'User not found' })
			}
			
			if (user.userRole !== 'admin') {
				// Log attempt without exposing user ID
				console.warn('Non-admin user attempted to access admin route')
				return res.status(403).json({ msg: 'Forbidden' })
			}
			
			req.decoded = decoded
			next()
		} catch (error) {
			console.error('Admin authentication error:', error.message)
			return res.status(500).json({ msg: 'Internal server error' })
		}
	})
}

function isSelfOrAdmin (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		return res.status(401).json({ msg: 'Token is missing' })
	}

	jwt.verify(token, process.env.JWT_KEY_SECRET, async (err, decoded) => {
		try {
			if (err) {
				return res.status(401).json({ msg: 'Unauthorized' })
			}

			const user = await UserService.find(decoded._id)
			if (!user) {
				return res.status(404).json({ msg: 'User not found' })
			}

			if (user.userRole !== 'admin' && user._id != req.params.id) {
				console.warn('Unauthorized access attempt to protected resource')
				return res.status(403).json({ msg: 'Forbidden' })
			}

			req.decoded = decoded
			next()
		} catch (error) {
			console.error('Authentication error:', error.message)
			return res.status(500).json({ msg: 'Internal server error' })
		}
	})
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if(file.fieldname == 'coverImageFile')
			cb(null, 'books/covers/')
		else if(file.fieldname == 'bookFile')
			cb(null, 'books/epubs/')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		const ext = file.originalname.split('.')[1]
		const kebabCase = file.originalname.replace(/\s+/g, '-').toLowerCase().split('.').slice(0, -1)
		cb(null, kebabCase + '-' + uniqueSuffix + '.' + ext)
	}
})

const uploadHandler = multer({ storage: storage })


export { isAuthenticated, isAdmin, isSelfOrAdmin, uploadHandler }