const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		let data = Object.fromEntries(formData.entries());

		if (data.name && data.surname) {
				// Combine name and surname into a single name field
				data.name = data.name + ' ' + data.surname;
				delete data.surname;
		}
		
		if(data.bookFile && data.coverImageFile){
			return await axios.post('', data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then(console.log).catch(console.error)
		}

		await axios.post('', data).then(console.log).catch(console.error)
})