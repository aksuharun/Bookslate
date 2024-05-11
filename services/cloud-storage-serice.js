import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'

dotenv.config()


class CloudStorageService{
	constructor(){
		this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
		this.keyFilename = process.env.GOOGE_CLOUD_KEYFILE
		this.bucketName = process.env.GOOGLE_CLOUD_BUCKET
		this.storage = new Storage({
			projectId: this.projectId,
			keyFilename: this.keyFilename
		})
	}

	async downloadFile(src, dest, bucket = this.bucketName) {
		await this.storage.bucket(bucket).file(src).download({ destination: dest })
			.then(() => console.log(`Downloaded to ${dest}`))
			.catch(err => console.error('ERROR:', err))
	}

	async uploadFile(src, dest, bucket = this.bucketName) {
		await this.storage.bucket(bucket).upload(src, { destination: dest })
			.then(() => console.log(`Uploaded to ${dest}`))
			.catch(err => console.error('ERROR:', err))
	}

	async uploadFiles(src, files = [], dest, bucket = this.bucketName) {
		try{
			files.forEach(async file => {
				await this.uploadFile(src + file, dest + file, bucket)
			})
		} catch(err){
			console.error('ERROR:', err)
		}
	}

}

export default new CloudStorageService()