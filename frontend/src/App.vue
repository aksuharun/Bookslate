<script>
import { mapState, mapStores } from 'pinia'
import { useBookStore } from '@/stores/book'

import Header from './components/header.vue'
import SectionByLevel from './components/section-by-level.vue'

export default {
	components: {
		Header,
		SectionByLevel
	},

	data() {
		return {
			levels : [
				{id: 0, name: 'Beginner', limit: 6},
				{id: 1, name: 'Intermediate', limit: 6},
				{id: 2, name: 'Advanced', limit: 6}
			],
			defaultLimit: 6
		}
	},
	
	computed: {
		filteredLevels() {
			return this.levels.filter(level => this.books[level.name] && this.books[level.name].length > 0)
		},
		...mapStores(useBookStore),
		...mapState(useBookStore, ['books'])
	},
	
	methods: {
		fetchBooks(level, limit) {
			this.bookStore.fetchBooks(level, limit)
		},
		viewMore(level) {
			level.limit += this.defaultLimit
			this.bookStore.fetchBooks(level.name, level.limit)
		}
	},
	
	mounted() {
		this.levels.forEach(level => {
			this.fetchBooks(level.name, level.limit)
		})
	}
}
</script>

<template lang="pug">

Header

main(class="main")
	SectionByLevel(v-for="level in filteredLevels" :key="level.id" :level="level" :books="books" @viewMore="viewMore")
	

</template>