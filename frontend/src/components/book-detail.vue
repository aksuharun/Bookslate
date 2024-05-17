<script>
export default {
	name: 'BookDetail'
}
</script>

<template lang="pug">
main(class="main")
	div(class="blur-layer")
		section(class="book-detail bg-color")
			h2(class="text") The Happy Prince and The Selfish Giant
			i(class="fa-solid fa-xmark text-color")
			img(src="https://www.blackcat-cideb.com/uploads/2020/02/20027_COVER_The-Happy-Prince_22b4e996abff550c7150b210f52b9c20.jpg")
			ul
				li(class="text")
					p 
						strong Title: 
						| The Happy Prince and The Selfish Giant
					p 
						strong Author: 
						| Oscar Wilde
					p 
						strong Level: 
						| Beginner
			button Start Reading
</template>

<style scoped>

.blur-layer {
	display: flex;
	justify-content: center;
	align-items: center;

	position: absolute;
	top: 0;
	left: 0;
	
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(8px);
}

.book-detail {
	width: 46rem;
	height: 25rem;
	border-radius: 4px;
}

h2 {
	font-weight: 600;
}
li {
	list-style-type: none;
}

strong{
	font-weight: 500;
}
</style>