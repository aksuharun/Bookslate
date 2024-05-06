class Service {
	
	async add(item){
		return await this.model.create(item)
	}
	
	async findAll(){
		return await this.model.find()
	}

	async find(id){
		return await this.model.findById(id)

	}
	
	async update(id, item){
		return await this.model.findByIdAndUpdate(id, item, {new: true}) // {new: true} returns the updated document
	}
	
	async del(id){
		return await this.model.findByIdAndDelete(mongoose)
	}

}


export default Service