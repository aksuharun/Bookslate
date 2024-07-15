import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const translationHistorySchema = new mongoose.Schema({
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
	word: {
		type: String,
		required: true
	},
	translation: {
		type: String,
		required: true
	},
	sourceLanguage: {
		type: String,
		required: true
	},
	translationLanguage: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	isSaved: {
		type: Boolean,
		default: false
	}
})

translationHistorySchema.plugin(autopopulate)

const TranslationHistoryModel = mongoose.model('TranslationHistory', translationHistorySchema)

export default TranslationHistoryModel