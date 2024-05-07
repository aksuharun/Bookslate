import logService from "../services/log-service.js"

function logCreation(req, res, next){
	if(req.originalUrl.includes('user')){
		// logService.add({
			
		// })
	}
	next()
}

export { logCreation }