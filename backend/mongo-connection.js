import mongoose from 'mongoose'

async function main(){
	try{
		await mongoose.connect('mongodb://localhost:27017/test')
		console.log('Connected to MongoDB!')
	}
	catch(err){
		console.log('Cannot connect to MongoDB!', err)
		setTimeout(main, 30000) // Try again in 30 seconds
	}
}

main()