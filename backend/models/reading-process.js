import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const readingProcessSchema = new mongoose.Schema({
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

readingProcessSchema.plugin(autopopulate)

const ReadingProcessModel = mongoose.model('ReadingProcess', readingProcessSchema)

export default ReadingProcessModel