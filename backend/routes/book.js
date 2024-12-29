import express from 'express'
import fs from 'fs'
import path from 'path'
import LogService from '../services/log-service.js'
import BookService from '../services/book-service.js'
import LocalFileService from '../services/local-file-service.js'
import { isAuthenticated, isAdmin, uploadHandler } from './middleware.js'
import {EPub} from 'epub2'

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
		.catch((err) => {
			res.status(500).json({ msg: 'Error getting books'})
		
		})
})

router.get('/all/json', async (req, res) => {
	await BookService.findAll()
		.then(books => {
			res.json(books)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({ msg: 'Error getting books'})
		
		})
})

router.get('/update/:id', async(req, res) => {
	await BookService.find(req.params.id)
		.then(book => {
			res.render('update-book', { book: book })
		})
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'Book not found'})
		
		})
})

router.get('/cover/:id', async (req, res) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book || !book.coverImageUrl) {
			throw new Error('Cover image not found')
		}
		const imagePath = path.resolve(book.coverImageUrl)
		const readStream = fs.createReadStream(imagePath)
		res.setHeader('Content-Type', 'image/jpeg') 
		readStream.pipe(res)
	} catch (err) {
		console.log(err)
		res.status(404).json({ msg: 'Book not found' })
	}
})

router.get('/delete/:id', async (req, res) => {
	await BookService.find(req.params.id)
		.then(book => {
			res.render('delete', { id: book._id, itemType: 'Book' })			
		})
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'Book not found'})
		})
})

router.get('/:id', async (req, res) => {
	await BookService.find(req.params.id)
		.then(book => {
			res.render('data', { data: book })
		})
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'Book not found'})
		
		})
})

router.get('/:id/json', async (req, res) => {
	await BookService.find(req.params.id)
		.then(book => {
			if (!book) {
				return res.status(404).json({ msg: 'Book not found'})
			}
			res.json(book)
		})
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'Book not found'})
		})
})


router.get('/level/:level/limit/:limit', async (req, res) => {
	await BookService.findByField(
		{ "level": req.params.level.toLowerCase() },
		parseInt(req.params.limit)
	).then(books => {
			res.status(200).json(books)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({ msg: 'Error getting books'})
		})
})

router.get('/level/:level/count', async (req, res) => {
	await BookService.countByField({ "level": req.params.level.toLowerCase() })
		.then(count => {
			res.status(200).json(count)
		})
})

router.get('/epub/:id', async (req, res) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book || !book.fileUrl) {
			throw new Error('Book not found')
		}		
		var html
		EPub.createAsync(`./${book.fileUrl}`, null, '')
		.then(epub => {
			html = epub.flow
			console.log('test')
			.filter((chapter) => chapter.id.includes('item'))
			.map(chapter => {
				return new Promise((resolve, reject) => {
					epub.getChapter(chapter.id, (err, text) => {
						if(err) return reject(err)
						resolve(text)
					})
				})
			})
		})
		.catch(err => {
			console.log(err)
			res.status(404).json({ msg: 'Error reading book'})
		})
		res.send(html)
	}
	catch (err) {
		res.status(404).json({ msg: 'Book not found' })
	}
})

// Book Fields required for upload and update operations
const bookFields = [
	{
		name: "bookFile",
		maxCount: 1
	},
	{
		name: "coverImageFile",
		maxCount: 1
	}
]
// Post, Put, Delete Methods


router.post('/add', isAdmin, uploadHandler.fields(bookFields), async (req, res) => {
	const bookFile = req.files['bookFile'] ? req.files['bookFile'][0] : null
	const coverImageFile = req.files['coverImageFile'] ? req.files['coverImageFile'][0] : null
	if(!bookFile || !coverImageFile) throw new Error('Files not uploaded')
	try{
		const book = await BookService.add({
			title: req.body.title,
			author: req.body.author,
			level: req.body.level,
			language: req.body.language,
			fileUrl: 'books/epubs/' + bookFile.filename,
			coverImageUrl: 'books/covers/' + coverImageFile.filename,
		})

		await LogService.add({
			userId: req.decoded._id,
			action: 'Add',
			refType: 'Book',
			refId: book._id,
		})
		res.json({ msg: 'Book added successfully'})
	}catch(err){
		await LocalFileService.deleteFiles([bookFile.path, coverImageFile.path])
		console.log(err)
		res.status(400).json({ msg: 'Error adding book'})
	}
})

router.put('/update/:id', isAdmin, uploadHandler.fields(bookFields) , async (req, res) => {
	const bookFile = req.files['bookFile'] ? req.files['bookFile'][0] : null
	const coverImageFile = req.files['coverImageFile'] ? req.files['coverImageFile'][0] : null
	if(!bookFile || !coverImageFile) throw new Error('Files not uploaded')
		try {
			await BookService.update(req.params.id, {
				title: req.body.title,
				author: req.body.author,
				level: req.body.level,
				language: req.body.language,
				fileUrl: 'books/epubs/' + bookFile.filename,
				coverImageUrl: 'books/covers/' + coverImageFile.filename,
			})

			await LogService.add({
				userId: req.decoded._id,
				action: 'Update',
				refType: 'Book',
				refId: req.params.id,
			})
			res.json({ msg: 'Book updated successfully'})
	}catch(err){
		await LocalFileService.deleteFiles([bookFile.path, coverImageFile.path])
		console.log(err)
		res.status(400).json({ msg: 'Error updating book'})
	}
})

router.delete('/delete/:id', isAdmin, async (req, res) => {
	try{
		const book = await BookService.find(req.params.id)
		await LocalFileService.deleteFiles([book.fileUrl, book.coverImageUrl])
		await BookService.del(req.params.id)
		await LogService.add({
			userId: req.decoded._id,
			action: 'Delete',
			refType: 'Book',
			refId: req.params.id,
		})
		res.json({ msg: 'Book deleted successfully'})
	}catch(err){
		console.log(err)
		res.status(400).json({ msg: 'Error deleting book'})
	}
})

export default router