import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const backupLogSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		autopopulate: {
			maxDepth: 1
		}
	},
	date: {
		type: Date,
		default: Date.now
	},
})

backupLogSchema.plugin(autopopulate)

const BackupLogModel = mongoose.model('BackupLog', backupLogSchema)

export default BackupLogModel