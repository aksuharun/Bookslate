import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},

	author: {
		type: String,
		required: true,
	},

	language: {
		type: String,
		required: true
	},

	level: {
		type: String,
		required: true,
		set: (value) => value.toLowerCase()
	},

	coverImageUrl: {
		type: String,
	},

	fileUrl: {
		type: String,
		required: true
	},
})

const BookModel = mongoose.model('Book', bookSchema)

export default BookModel