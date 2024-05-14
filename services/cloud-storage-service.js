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

	async downloadFile(filePath, destinationPath, bucketName = this.bucketName) {
		await this.storage
			.bucket(bucketName)
			.file(filePath)
			.download({ destination: destinationPath })
	}

	async uploadFile(filePath, destinationPath, bucketName = this.bucketName) {
		await this.storage
			.bucket(bucketName)
			.upload(filePath, { destination: destinationPath })
	}

	async uploadFiles(filePath, files = [], destinationPath, bucketName = this.bucketName) {
		await Promise.all(files.map(async file => {
			await this.uploadFile(filePath + file, destinationPath + file.split('/').pop(), bucketName)
		}))
	}

	async moveFile(filePath, destinationPath, bucketName = this.bucketName) {
		await this.storage
			.bucket(bucketName)
			.file(filePath)
			.move(destinationPath)
	}

	async moveFiles(files = [], destinationPath, bucketName = this.bucketName) {
		await Promise.all(files.map(async file => {
			await this.moveFile(file, destinationPath + file.split('/').pop() , bucketName)
		}))
	}
	
	async deleteFile(filePath, bucketName = this.bucketName) {
		await this.storage
		.bucket(bucketName)
		.file(filePath)
		.delete()
	}

	async deleteFiles(files = [], bucketName = this.bucketName) {
		await Promise.all(files.map(async file => {
			await this.deleteFile(file, bucketName)
		}))
	}

	async getFileStream(filePath, bucketName = this.bucketName) {
		return this.storage
			.bucket(bucketName)
			.file(filePath)
			.createReadStream()
	}
}

export default new CloudStorageService()