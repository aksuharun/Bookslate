import express from 'express'
import BookService from '../services/book-service.js'
import LogService from '../services/log-service.js'
import {isAuthenticated, isAdmin} from './middleware.js'

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

router.post('/add', isAdmin, async (req, res) => {
	await BookService.add(req.body)
		.then((book) => {
			LogService.add({
					userId: req.decoded._id,
					action: 'Add',
					refType: 'Book',
					refId: book._id
			})
			res.json({ msg: 'Book added' })
		})
		.catch((err) => res.json(err))
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
		.catch((err) => res.json(err))
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
		.catch((err) => res.json(err))
})

export default router