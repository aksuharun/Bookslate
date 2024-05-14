import fs from 'fs'
import path from 'path'

class LocalFileService{
	async deleteFile(filePath){
		fs.unlink(filePath, (err) => {
			if(err) throw err
		})
	}

	async deleteFiles(files = []){
		await Promise.all(files.map(async file => {
			await this.deleteFile(file)
		}))
	}
}

export default new LocalFileService()