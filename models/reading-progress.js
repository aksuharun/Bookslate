import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate'

const readingProgress = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		autopopulate: {
			maxDepth: 1
		}
	},
	bookId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		autopopulate: {
			maxDepth: 1
		}
	},
	currentPage: {
		type: Number,
		default: 0
	},
	lastReadDate: {
		type: Date,
		default: Date.now
	}
})

readingProgressSchema.plugin(autopopulate)

const ReadingProgressModel = mongoose.model('ReadingProgress', readingProgressSchema)

export default ReadingProgressModel