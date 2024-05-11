import express from 'express'
import BookService from '../services/book-service.js'
import LogService from '../services/log-service.js'
import CloudStorageService from '../services/cloud-storage-serice.js'
import { isAuthenticated, isAdmin } from './middleware.js'
import multer from 'multer'

// Set up custom storage for Multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
			cb(null, 'uploads/')
			console.log('File uploaded to uploads folder')
	},
	filename: function (req, file, cb) {
			// Use the original file name and append the original extension
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
			const ext = file.originalname.split('.').pop()
			cb(null, file.fieldname + '-' + uniqueSuffix + '.' +ext)
			console.log('File name changed')
	}
})

const upload = multer({ storage: storage }) 

const router = express.Router()

// Get Methods

router.get('/add', (req, res) => {
	res.render('add-book')
})

router.get('/all', async (req, res) => {
	await BookService.findAll()
		.then(books => {
			res.render('list', { items: books, itemType:'Book' })
		})
		.catch((err) => res.json(err))
})

router.get('/all/json', async (req, res) => {
	await BookService.findAll()
		.then(books => {
			res.json(books)
		})
		.catch((err) => res.json(err))
})

router.get('/update/:id', (req, res) => {
	res.render('update-book', { id: req.params.id })
})

router.get('/delete', (req, res) => {
	res.render('delete', { itemType: 'Book' })
})

router.get('/:id', async (req, res) => {
	await BookService.find(req.params.id)
		.then(book => {
			res.render('data', { data: book })
		})
		.catch((err) => res.json(err))
})

router.get('/:id/json', async (req, res) => {
	await BookService.find(req.params.id)
		.then(book => {
			res.json(book)
		})
		.catch((err) => res.json(err))
})

// Post, Put, Delete Methods

const bookFields = [
	{ name: 'bookFile', maxCount: 1 },
	{ name: 'coverImageFile', maxCount: 1 }
]

router.post('/add', isAdmin, upload.fields(bookFields), async (req, res) => {
	console.log(req.body)
	console.log(req.files)
	res.json({ msg: 'Book added' })
})

router.put('/update/:id', isAdmin, async (req, res) => {
	await BookService.update(req.params.id, req.body)
		.then(() =>{
			LogService.add({
				userId: req.decoded._id,
				action: 'Update',
				refType: 'Book',
				refId: req.params.id
			})
			res.json({ msg: 'Book updated' })
		})
		.catch((err) => res.status(400).json(err))
})

router.delete('/delete/:id', isAdmin, async (req, res) => {
	await BookService.delete(req.params.id)
		.then(() => {
			LogService.add({
				userId: req.decoded._id,
				action: 'Delete',
				refType: 'Book',
				refId: req.params.id
			})
			res.json({ msg: 'Book deleted' })
		})
		.catch((err) => res.status(400).json(err))
})

export default router