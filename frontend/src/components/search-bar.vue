<script>
export default {
	name: 'SearchBar',
}
</script>

<template lang="pug">
.search-bar
	.input-wrapper
		input(type="text" v-model="searchQuery")
</template>

<style scoped>
.search-bar {
	display: flex;
	align-items: center;
}

input {
	width:192px;
	height: 32px;
	background: none;
	border: 2px solid var(--text-color);
	border-radius: 8px;
}

.input-wrapper::before {
  content: '🔍';
  margin-right: -2rem;
}

</style>