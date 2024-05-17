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

	async findByField(field, limit){ 
		return await this.model.find(field).limit(limit)
	}

	async countByField(field){
		return await this.model.countDocuments(field)
	}

	async count(){
		return await this.model.countDocuments()
	}
	
	async update(id, item){
		return await this.model.findByIdAndUpdate(id, item, {new: true}) // {new: true} returns the updated document
	}
	
	async del(id){
		return await this.model.findByIdAndDelete(id)
	}
}

export default Service