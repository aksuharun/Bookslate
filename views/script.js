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

		await axios.post('', {...data})
				.then(console.log)
				.catch(console.error);
})