import mongoose from 'mongoose'

async function main(){
	await mongoose.connect('mongodb://localhost:27017/test')
	console.log('Connected to MongoDB!')
}

main()