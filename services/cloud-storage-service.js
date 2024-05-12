import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'

dotenv.config()


class CloudStorageService{
	constructor(){
		this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
		this.keyFilename = process.env.GOOGLE_CLOUD_KEYFILE
		this.bucketName = process.env.GOOGLE_CLOUD_BUCKET
		this.storage = new Storage({
			projectId: this.projectId,
			keyFilename: this.keyFilename
		})
	}

	async downloadFile(src, dest, bucket = this.bucketName) {
		await this.storage
			.bucket(bucket)
			.file(src)
			.download({ destination: dest })
	}

	async uploadFile(src, dest, bucket = this.bucketName) {
		await this.storage
			.bucket(bucket)
			.upload(src, { destination: dest })
	}

	async uploadFiles(src, files = [], dest, bucket = this.bucketName) {
		files.forEach(async file => {
			await this.uploadFile(src + file, dest + file, bucket)
		})
	}

	async moveFile(src, dest, bucket = this.bucketName) {
		await this.storage
			.bucket(bucket)
			.file(src)
			.move(dest)
	}
	async moveFiles(files = [], dest, bucket = this.bucketName) {
		files.forEach(async file => {
			await this.moveFile(file, dest + file.split('/').pop() , bucket)
		})
	}
	
	async deleteFile(src, bucket = this.bucketName) {
		await this.storage
		.bucket(bucket)
		.file(src)
		.delete()
	}
}

export default new CloudStorageService()