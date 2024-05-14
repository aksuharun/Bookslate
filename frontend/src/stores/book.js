import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('book', {
	state: () => ({
		books: [],
	}),
	actions: {
		async fetchBooks() {
			const response = await axios.get('http://localhost:3000/book/all/json')
			this.books = response.data
		},
	},
})