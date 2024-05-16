<script>
export default {
	name: 'SearchBar',
	data() {
		return {
			isFocused: false,
		}
	}
}
</script>

<template lang="pug">
.search-bar
	.input-wrapper(:class="{ 'input-focused': isFocused }")
		input(type="text" v-model="searchQuery" @focus="isFocused = true" @blur="isFocused = false")
</template>

<style scoped>
.search-bar {
	display: flex;
	align-items: center;
}

input {
	width:11rem;
	height: 2rem;
	background: none;
	border: 2px solid var(--text-color);
	border-radius: 0.5rem;
	padding: 1px calc(.5rem + 2px); /*add default padding too*/
}

.input-wrapper::before {
  content: '\f002';
	font-family: "FontAwesome";
  margin-right: -2rem;
	font-size:1rem;
}

.input-wrapper.input-focused::before {
	visibility: hidden;
}

</style>