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
	div(class="img-wrapper")
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

.img-wrapper {
	padding: 0.5rem 0;
	width: 100%;
	display: flex;
	justify-content: center;
}

img{
	height: 10rem;
	width: auto;
	border-radius: 4px;
	box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25);
}

.book-title {
	text-align: center;
	font-size: 12px;
	margin-top:1rem
}
</style>