<script>
import BookCard from './book-card.vue';
import { useBookStore } from '@/stores/book';

export default {
	name: 'SectionByLevel',
	props:{
		level: '',
		books: [],
	},
	data() {
		return {
			bookStore: useBookStore(),
		}
	},
	components: {
		BookCard
	},
	computed:{
		showViewMore() {
			const levelCount = this.bookStore.bookCount[this.level].count
			const levelLimit = this.bookStore.bookCount[this.level].limit
			return levelCount > levelLimit
		}
	},
	methods: {
		capatilizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},

		viewMore() {
			this.bookStore.fetchBooks(this.level)
		}
	}
}
</script>

<template lang="pug">
section(class="section")
	h2(class="section-title") {{ capatilizeFirstLetter(level) }}
	div(class="books grid")
		BookCard(v-for="book in books" :key="book._id" :book="book")
	p(class="view-more text" v-if="showViewMore" ) View More
</template>


<style scoped>
.section {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top:4rem;
}

.section-title{
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 600;
	align-self: flex-start;
}

.books.grid {
	display: grid;
	grid-template-columns: repeat(6, 160px);
	gap: 2rem; 

	margin-top: 1.5rem;
}

.view-more {
	color: var(--text-color-75);
	cursor: pointer;
	background: none;
	border: none;
	font-size: .75rem;
	margin-top: 2rem
}

.view-more:hover {
	color: var(--text-color);
}

.view-more:focus {
	outline: none;
}
</style>