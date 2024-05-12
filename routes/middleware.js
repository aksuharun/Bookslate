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
		if (err) {
			return res.status(401).json({ msg: 'Unauthorized' })
		}
		const user = await UserService.find(decoded._id)
		if (user.userRole != 'admin') {
			console.log('${user._id trying to access admin route}')
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

multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		const ext = file.mimetype.split('/').pop()
		const kebabCase = file.originalname.replace(/\s+/g, '-').toLowerCase().split('.').slice(0, -1)
		cb(null, kebabCase + '-' + uniqueSuffix + '.' + ext)
	}
})

const uploadHandler = multer({ storage: storage })


export { isAuthenticated, isAdmin, isSelfOrAdmin, uploadHandler}