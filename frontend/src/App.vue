<script>
import { mapState, mapStores } from 'pinia'
import { useBookStore } from '@/stores/book'

import SearchBar from './components/search-bar.vue'

export default {
	components: {
		SearchBar
	},
	computed: {
		...mapStores(useBookStore),
		...mapState(useBookStore, ['books'])
	},
	methods: {
		fetchBooks() {
			this.bookStore.fetchBooks()
		}
	},
	mounted() {
		this.fetchBooks()
	}
}
</script>

<template lang="pug">
header(class="container")
	h1(class="logo") Bookslate
	SearchBar
	div
</template>