import express from 'express'
import fs from 'fs'
import path from 'path'
import LogService from '../services/log-service.js'
import BookService from '../services/book-service.js'
import LocalFileService from '../services/local-file-service.js'
import { isAuthenticated, isAdmin, uploadHandler } from './middleware.js'
import { EPub } from 'epub2'
import { NotFoundError, ValidationError, BadRequestError, InternalServerError, ForbiddenError } from '../errors/api-errors.js'

const router = express.Router()

// Get Methods
router.get('/add', isAdmin, (req, res, next) => {
	try {
		res.render('add-book')
	} catch (error) {
		next(error)
	}
})

router.get('/all', isAuthenticated, async (req, res, next) => {
	try {
		const books = await BookService.findAll()
		res.render('list', { items: books, itemType: 'Book' })
	} catch (error) {
		next(error)
	}
})

router.get('/all/json', async (req, res, next) => {
	try {
		const books = await BookService.findAll()
		res.json(books)
	} catch (error) {
		next(error)
	}
})

router.get('/update/:id', async (req, res, next) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book) {
			throw new NotFoundError('Book not found')
		}
		res.render('update-book', { book })
	} catch (error) {
		next(error)
	}
})

router.get('/cover/:id', async (req, res, next) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book || !book.coverImageUrl) {
			throw new NotFoundError('Cover image not found')
		}
		const imagePath = path.resolve(book.coverImageUrl)
		if (!fs.existsSync(imagePath)) {
			throw new NotFoundError('Cover image file not found')
		}
		const readStream = fs.createReadStream(imagePath)
		res.setHeader('Content-Type', 'image/jpeg')
		readStream.pipe(res)
	} catch (error) {
		next(error)
	}
})

router.get('/delete/:id', async (req, res, next) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book) {
			throw new NotFoundError('Book not found')
		}
		res.render('delete', { id: book._id, itemType: 'Book' })
	} catch (error) {
		next(error)
	}
})

router.get('/:id', async (req, res, next) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book) {
			throw new NotFoundError('Book not found')
		}
		res.render('data', { data: book })
	} catch (error) {
		next(error)
	}
})

router.get('/:id/json', async (req, res, next) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book) {
			throw new NotFoundError('Book not found')
		}
		res.json(book)
	} catch (error) {
		next(error)
	}
})

router.get('/level/:level/limit/:limit', async (req, res, next) => {
	try {
		const books = await BookService.findByField(
			{ 'level': req.params.level.toLowerCase() },
			parseInt(req.params.limit)
		)
		res.status(200).json(books)
	} catch (error) {
		next(error)
	}
})

router.get('/level/:level/count', async (req, res, next) => {
	try {
		const count = await BookService.countByField({ 'level': req.params.level.toLowerCase() })
		res.status(200).json(count)
	} catch (error) {
		next(error)
	}
})

router.get('/epub/:id', async (req, res, next) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book || !book.fileUrl) {
			throw new NotFoundError('Book not found')
		}

		const epubPath = path.resolve(`./${book.fileUrl}`)
		if (!fs.existsSync(epubPath)) {
			throw new NotFoundError('EPUB file not found')
		}

		const epub = await EPub.createAsync(epubPath, null, '')
		const chapters = epub.flow
			.filter((chapter) => chapter.id.includes('item'))
			.map(chapter => {
				return new Promise((resolve, reject) => {
					epub.getChapter(chapter.id, (err, text) => {
						if (err) reject(err)
						resolve(text)
					})
				})
			})

		const html = await Promise.all(chapters)
		res.send(html.join(''))
	} catch (error) {
		next(error)
	}
})

// Book Fields required for upload and update operations
const bookFields = [
	{ name: 'bookFile', maxCount: 1 },
	{ name: 'coverImageFile', maxCount: 1 }
]

// Post, Put, Delete Methods
router.post('/add', isAdmin, uploadHandler.fields(bookFields), async (req, res, next) => {
	let bookFile = null
	let coverImageFile = null

	try {
		// Ensure user is authorized (double-check)
		if (!req.decoded) {
			throw new ForbiddenError('Unauthorized access')
		}

		bookFile = req.files['bookFile'] ? req.files['bookFile'][0] : null
		coverImageFile = req.files['coverImageFile'] ? req.files['coverImageFile'][0] : null

		if (!bookFile || !coverImageFile) {
			throw new ValidationError('Book file and cover image are required')
		}

		if (!req.body.title || !req.body.author || !req.body.level || !req.body.language) {
			throw new ValidationError('All book details are required')
		}

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

		res.json({ msg: 'Book added successfully' })
	} catch (error) {
		// Clean up uploaded files if there's an error
		if (bookFile?.path || coverImageFile?.path) {
			await LocalFileService.deleteFiles([bookFile?.path, coverImageFile?.path].filter(Boolean))
		}
		next(error)
	}
})

router.put('/update/:id', isAdmin, uploadHandler.fields(bookFields), async (req, res, next) => {
	const bookFile = req.files['bookFile'] ? req.files['bookFile'][0] : null
	const coverImageFile = req.files['coverImageFile'] ? req.files['coverImageFile'][0] : null

	try {
		if (!bookFile || !coverImageFile) {
			throw new ValidationError('Book file and cover image are required')
		}

		if (!req.body.title || !req.body.author || !req.body.level || !req.body.language) {
			throw new ValidationError('All book details are required')
		}

		const book = await BookService.update(req.params.id, {
			title: req.body.title,
			author: req.body.author,
			level: req.body.level,
			language: req.body.language,
			fileUrl: 'books/epubs/' + bookFile.filename,
			coverImageUrl: 'books/covers/' + coverImageFile.filename,
		})

		if (!book) {
			throw new NotFoundError('Book not found')
		}

		await LogService.add({
			userId: req.decoded._id,
			action: 'Update',
			refType: 'Book',
			refId: req.params.id,
		})

		res.json({ msg: 'Book updated successfully' })
	} catch (error) {
		await LocalFileService.deleteFiles([bookFile?.path, coverImageFile?.path].filter(Boolean))
		next(error)
	}
})

router.delete('/delete/:id', isAdmin, async (req, res, next) => {
	try {
		const book = await BookService.find(req.params.id)
		if (!book) {
			throw new NotFoundError('Book not found')
		}

		await LocalFileService.deleteFiles([book.fileUrl, book.coverImageUrl])
		await BookService.del(req.params.id)
		
		await LogService.add({
			userId: req.decoded._id,
			action: 'Delete',
			refType: 'Book',
			refId: req.params.id,
		})

		res.json({ msg: 'Book deleted successfully' })
	} catch (error) {
		next(error)
	}
})

export default router