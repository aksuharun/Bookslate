import mongoose from 'mongoose'

async function main(){
	try{
		await mongoose.connect(process.env.MONGODB_URI)
		console.log('Connected to MongoDB!')
	}
	catch(err){
		console.log('Cannot connect to MongoDB!', err)
		setTimeout(main, 30000) // Try again in 30 seconds
	}
}

main()