<script>
import { mapState, mapStores } from 'pinia'
import { useBookStore } from '@/stores/book'

import AppHeader from '../components/header.vue'
import SectionByLevel from '../components/section-by-level.vue'
import BookDetail from '../components/book-detail.vue'

export default {
	components: {
		AppHeader,
		SectionByLevel,
		BookDetail,
	},

	data() {
		return {
			showBookDetail: false,
			selectedBook: null,
		}
	},
	computed: {
		...mapStores(useBookStore),
		...mapState(useBookStore, ['books']),
		
		getActiveBookLevels() {
			return this.bookStore.getActiveBookLevels
		},
		getBooksByLevel() {
			return (level) => this.bookStore.getBooksByLevel(level)
		},
		getBookLevels() {
			return this.bookStore.getBookLevels 
		},
	},
	mounted() {
		this.getBookLevels.forEach(level => {
			this.fetchBooks(level)
			this.fetchBookCount(level)
		})
	},
	unmounted() {
		this.bookStore.clearBooks()
	},
	methods: {
		fetchBooks(level) {
			this.bookStore.fetchBooks(level)
		},

		fetchBookCount(level) {
			this.bookStore.fetchBookCount(level)
		},
		toggleBookDetail(book = null) {
			this.showBookDetail = !this.showBookDetail
			this.selectedBook = book
		},
	},
}

</script>

<template lang="pug">
AppHeader

main(class="main")
	SectionByLevel(
		v-for="level in getActiveBookLevels" 
		:level="level" 
		:books="getBooksByLevel(level)"
		@toggle-book-detail="toggleBookDetail" 
	)
	BookDetail(
		v-if="showBookDetail"
		:book="selectedBook"
		@toggle-book-detail="toggleBookDetail" 
	)

</template>