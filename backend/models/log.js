import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const logSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		autopopulate: {
			maxDepth: 1,
		},
	},
	action: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	refType: {
		type: String,
		required: true
	},
	refId: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: 'refType',
		required: true,
		autopopulate: {
			maxDepth: 1,
		},
	},
})

logSchema.plugin(autopopulate)

const LogModel =  mongoose.model('Log', logSchema)

export default LogModel