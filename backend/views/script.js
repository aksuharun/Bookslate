const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
		e.preventDefault()

		const formData = new FormData(form)
		let data = Object.fromEntries(formData.entries())

		if (data.name && data.surname) {
				// Combine name and surname into a single name field
				data.name = data.name + ' ' + data.surname
				delete data.surname
		}

		//check is there a input type = file
		const headers = {}
		if(form.querySelector('input[type="file"]')) {
				headers['Content-Type'] = 'multipart/form-data'
		}
		
		const method = form.getAttribute('method')
		axios({
				method: method,
				url: '',
				data: data,
				headers: headers
		})
		.then(response => {
				console.log(response)
		})
		.catch(error => {
				console.error(error)
		})
})