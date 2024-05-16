import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('book', {
	state: () => ({
		books: {
			"Beginner": [],
			"Intermediate": [],
			"Advanced": [],
		},
	}),
	actions: {
		async fetchBooks(level, limit) {
			try{
				const response = await axios.get(`http://localhost:3000/book/level/${level}/limit/${limit}`)
				this.books[level] = response.data
			} catch (err) {
				console.error(err)
			}
		},
	},
})