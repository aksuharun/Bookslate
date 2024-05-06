class Service {
	
	async add(item){
		try{
			return await this.model.create(item)
		}
		catch(err){
			throw err
		}
	}
	
	async findAll(){
			return await this.model.find()
	}

	async find(id){
		return await this.model.findById(id)
	}
	
	async update(id, item){
		if(await this.find(id)){
			try{
				return await this.model.findByIdAndUpdate(id, item, {new: true}) // {new: true} returns the updated document
			}catch(err){
				throw err
			}
		}
	}
	
	async del(id){
		if(await this.find(id)){
			try{
				return await this.model.findByIdAndDelete(mongoose)
			}
			catch(err){
				throw err
			}
		}
		else{
			throw new Error('Item not found')
		}
	}

}


export default Service