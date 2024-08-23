<script>
import { mapStores, mapState } from 'pinia'
import { useBookStore } from '@/stores/book'
export default {
	name: "Book",
	computed: {
		...mapStores(useBookStore),
		...mapState(useBookStore, ['books']),

		book() {
			return this.bookStore.getBook
		}
	},
	methods: {
		fetchBook(id) {
			this.bookStore.fetchBook(id)
		}
	},
	mounted() {
		this.fetchBook(this.$route.params.id)
	},
}
</script>

<template lang="pug">
section(class="reading-page")
	main(class="epub text")
		h1 {{ book.title }}
		h2 {{ book.author }}
</template>

<style scoped>
.reading-page {
	width: 100vw;
	height: 100vh;
	background-color: var(--primary-color);
	display: flex;
	justify-content: center;
}

.epub {
	width:48rem;
	height: 100vh;
	padding: 4rem 8rem;
	background-color: var(--bg-color);
}
</style>