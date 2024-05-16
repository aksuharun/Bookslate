<script>
import BookCard from './book-card.vue';

export default {
	name: 'SectionByLevel',
	props:{
		level: Object,
		books: Object
	},
	components: {
		BookCard
	},
	methods: {
		viewMore() {
			this.$emit('viewMore', this.level)
		}
	}
}
</script>

<template lang="pug">
section(class="section")
	h2(class="section-title") {{ level.name }}
	div(class="books grid")
		BookCard(v-for="book in books[(level.name)]" :key="book._id" :book="book")
	button(class="view-more") View More
</template>


<style scoped>
.section {
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top:2rem;
}
.books.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	grid-auto-rows: 200px; 
	gap: 32px; 
}

.view-more {
	color: var(--text-color-75);
	cursor: pointer;
	background: none;
	border: none;
	font-size: 12px;
}
</style>