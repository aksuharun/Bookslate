<script>
export default {
	name: 'BookCard',
	props:{
		book: Object
	}
}
</script>

<template lang="pug">
div(class="book")
	img(:src="'http://localhost:3000/book/cover/' + book._id")
	p(class="book-title text") {{ book.title }}
</template>

<style scoped>
.book {
	display: flex;
	flex-direction: column;
	align-items: center;

	width: 10rem;
}

img{
	height: 10rem;
	width: auto;
}

.book-title {
	text-align: center;
	font-size: 12px;
}
</style>