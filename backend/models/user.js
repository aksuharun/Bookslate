import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	nativeLanguage: {
		type: String,
		required: true
	},
	targetLanguage: {
		type: String,
		required: true
	},
	userRole: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
})

const UserModel =	mongoose.model('User', UserSchema)

export default UserModel