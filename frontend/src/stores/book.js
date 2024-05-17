import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('book', {
	state: () => ({
		books: [],
		bookCount: {
			beginner: { count: 0, limit: 0 },
			intermediate: { count: 0,	limit: 0 },
			advanced: { count: 0,	limit: 0 }
		},
		defaultLimit: 6
	}),
	getters: {
		getBooksByLevel: (state) => (level) =>{
			return state.books.filter(book => book.level == level)
		},

		getActiveBookLevels: (state) => {
			return Object.keys(state.bookCount).filter(level => state.bookCount[level].count > 0)
		},

		getBookLevels(state) {
			return Object.keys(state.bookCount)
		}
	},

	actions: {
		async fetchBooks(level, limit = this.defaultLimit) {
			try{
				const response = await axios.get(`http://localhost:3000/book/level/${level}/limit/${limit}`)
				this.books = this.books.concat(response.data)
				this.bookCount[level].limit += this.defaultLimit
			} catch (err) {
				console.error(err)
			}
		},

		async fetchBookCount(level) {
			try{
				const response = await axios.get(`http://localhost:3000/book/level/${level}/count`)
				this.bookCount[level].count = response.data
			} catch (err) {
				console.error(err)
			}
		}
	},
})