<script>
export default {
	name: 'BookDetail',
	props: {
		book: {
			type: Object,
			required: true
		}
	},
	emits: ['toggle-book-detail'],
	data() {
		return {
			isBookDetailVisible: true,
		}
	},
	methods: {
		toggleBookDetail() {
			this.$emit('toggle-book-detail')
		},
		startReading() {
			this.$router.push(`/read/${this.book._id}`)
		}
	}
}
</script>

<template lang="pug">
div(
	class="blurLayer"
	v-show="isBookDetailVisible"
	@click.self="toggleBookDetail"
	)
	article(class="bookDetail")
		header(class="bookDetail-header")
			h2(class="bookDetail-heading text") {{ book.title }}
			i(
				class="icon icon--primary fa-solid fa-xmark"
				@click.self="toggleBookDetail"
			)
		div(class="bookDetail-body")
			img(
				class="coverImage"
				:src="'http://localhost:3000/book/cover/' + book._id"
				loading="lazy"
				alt="Book Cover"
			)
			div(class="bookDetail-content")
				ul
					li(class="text")
						strong Title:&nbsp;
						| {{ book.title }}
					li(class="text")
						strong Author:&nbsp;
						| {{ book.author }}
					li(class="text")
						strong Level:&nbsp;
						| {{ book.level }}
				button(class="button button--dark" @click="startReading") Start Reading
</template>

<style scoped>
.blurLayer {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(.5rem);
}

.bookDetail {
	width: 46rem;
	height: 25rem;
	border-radius: .25rem;
	background-color: var(--bg-color);
	padding: 2rem 2rem 2rem 4rem;
}

.bookDetail-header {
	display: flex;
	justify-content: space-between;
}

.bookDetail-heading {
	font-size: 1.5rem;
	font-weight: 600;
	padding-top: .5rem;
}

.fa-xmark {
	cursor: pointer;
}

.bookDetail-body {
	display: flex;
	margin-top: 1.5rem;
}

.coverImage {
	width: 11.25rem;
	max-height: 16rem;
}

.bookDetail-content {
	display: flex;
	flex-direction: column;
	margin: 2rem 0 0 2rem;
	width: 26rem;
	height: 15rem;
}

ul {
	margin-bottom: auto;
}

li {
	list-style-type: none;
	color: var(--text-color-75);
	font-size: 1.125rem;
}

li:not(:last-child) {
	margin-bottom: .5rem;
}

li:last-of-type {
	text-transform: capitalize;
}

strong {
	font-weight: 500;
	color: var(--text-color);
}

.button {
	align-self: flex-end;
}
</style>