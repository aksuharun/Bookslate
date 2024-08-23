<script>
import { mapState, mapStores } from 'pinia'
import { useBookStore } from '@/stores/book'

import Header from '../components/header.vue'
import SectionByLevel from '../components/section-by-level.vue'
import BookDetail from '../components/book-detail.vue'

export default {
	components: {
		Header,
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
	mounted() {
		this.getBookLevels.forEach(level => {
			this.fetchBooks(level)
			this.fetchBookCount(level)
		})
	},
	unmounted() {
		this.bookStore.clearBooks()
	},
}

</script>

<template lang="pug">

Header

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