import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const readingProgressSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		autopopulate: {
			maxDepth: 1
		}
	},
	bookId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Book',
		required: true,
		autopopulate: {
			maxDepth: 1
		}
	},
	currentChapter: {
		type: Number,
		default: 1
	},
	scrollPosition: {
		type: Number,
		default: 0
	},
	totalChapters: {
		type: Number,
		required: true
	},
	lastReadDate: {
		type: Date,
		default: Date.now
	}
})

readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true })
readingProgressSchema.plugin(autopopulate)

const ReadingProgressModel = mongoose.model('ReadingProgress', readingProgressSchema)

export default ReadingProgressModel