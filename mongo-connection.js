import mongoose from 'mongoose'
	
const database = 'bookslate'

const uri = 'mongodb+srv://' + process.env.MONGODB_USER_NAME  + ':' + process.env.MONGODB_USER_PASSWORD + '@cluster0.cq8ibhd.mongodb.net/' + database + '?retryWrites=true&w=majority&appName=Cluster0'

const clientOptions = { 
	serverApi: { 
		version: '1', 
		strict: true, 
		deprecationErrors: true 
	}
}


async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
		console.log("Error connecting to MongoDB: ", err)
	}
	
}
run().catch(console.dir);

process.on('SIGINT', async () => {
	await mongoose.disconnect()
	process.exit(0)
})