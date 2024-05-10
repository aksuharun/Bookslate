import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'

dotenv.config()


const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
const keyFilename = process.env.GOOGE_CLOUD_KEYFILE

const storage = new Storage({
	projectId,
	keyFilename
})

async function downloadFile(bucket, src, dest) {
	await storage.bucket(bucket).file(src).download({ destination: dest })
		.then(() => console.log(`Downloaded to ${dest}`))
		.catch(err => console.error('ERROR:', err))
}

async function uploadFile(bucket, src, dest) {
	await storage.bucket(bucket).upload(src, { destination: dest })
		.then(() => console.log(`Uploaded to ${dest}`))
		.catch(err => console.error('ERROR:', err))
}

export { downloadFile, uploadFile }