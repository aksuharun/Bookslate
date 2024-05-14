import express from 'express'
import LogService from '../services/log-service.js'
import BookService from '../services/book-service.js'
import CloudStorageService from '../services/cloud-storage-service.js'
import LocalFileService from '../services/local-file-service.js'
import { isAuthenticated, isAdmin, uploadHandler } from './middleware.js'

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
			console.log(book)
			res.render('update-book', { book: book })
		})
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'Book not found'})
		
		})
})

router.get('/cover/:id', isAuthenticated, async (req, res) => {
	try{
		const book = await BookService.find(req.params.id)
		const imageStream =  await CloudStorageService.getFileStream(book.coverImageUrl)
		imageStream.pipe(res)
	}catch(err){
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
			res.json(book)
		})
		.catch((err) => {
			console.log(err)
			res.status(404).json({ msg: 'Book not found'})
		
		})
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
		await CloudStorageService.uploadFiles(
			'uploads/',
			[bookFile.filename, coverImageFile.filename],
			'books/'
		)
		await LocalFileService.deleteFiles([bookFile.path, coverImageFile.path])
		const book = await BookService.add({
			title: req.body.title,
			author: req.body.author,
			language: req.body.language,
			level: req.body.level,
			fileUrl: 'books/' + bookFile.filename,
			coverImageUrl: 'books/' + coverImageFile.filename,
		})
		await LogService.add({
			userId: req.decoded._id,
			action: 'Add',
			refType: 'Book',
			refId: book._id,
		})
		res.json({ msg: 'Book added successfully'})
	}catch(err){
		console.log(err)
		res.status(400).json({ msg: 'Error adding book'})
	}
})

router.put('/update/:id', isAdmin, uploadHandler.fields(bookFields) , async (req, res) => {
	const bookFile = req.files['bookFile'] ? req.files['bookFile'][0] : null
	const coverImageFile = req.files['coverImageFile'] ? req.files['coverImageFile'][0] : null
	if(!bookFile || !coverImageFile) throw new Error('Files not uploaded')
	try {

		const book = await BookService.find(req.params.id)
		await CloudStorageService.deleteFiles(
			[book.fileUrl, book.coverImageUrl],
		)
		await CloudStorageService.uploadFiles(
			'uploads/',
			[bookFile.filename, coverImageFile.filename],
			'books/'
		)
		await LocalFileService.deleteFiles([bookFile.path, coverImageFile.path])
		await BookService.update(req.params.id, {
			title: req.body.title,
			author: req.body.author,
			language: req.body.language,
			level: req.body.level,
			fileUrl: 'books/' + bookFile.filename,
			coverImageUrl: 'books/' + coverImageFile.filename,
		})
		await LogService.add({
			userId: req.decoded._id,
			action: 'Update',
			refType: 'Book',
			refId: book._id,
		})
		res.json({ msg: 'Book updated successfully'})
	}catch(err){
		console.log(err)
		res.status(400).json({ msg: 'Error updating book'})
	}
})

router.delete('/delete/:id', isAdmin, async (req, res) => {
	try{
		const book = await BookService.find(req.params.id)
		await CloudStorageService.deleteFiles([book.fileUrl, book.coverImageUrl])
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