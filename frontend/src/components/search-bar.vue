<script>
export default {
	name: 'SearchBar',
	data() {
		return {
			isFocused: false,
			searchQuery: null,
		}
	},
	computed:{
		hideSearchIcon() {
			return this.isFocused || this.searchQuery
		}
	}
}
</script>

<template lang="pug">
.search-bar
	.input-wrapper(:class="{ 'hide-icon': hideSearchIcon } ")
		input(type="text" @focus="isFocused = true" @blur="isFocused = false" v-model="searchQuery")
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
	padding: 0 0.5rem; /*add default padding too*/
}

.input-wrapper::before {
  content: '\f002';
	font-family: "FontAwesome";
  margin-right: -2rem;
	font-size:1rem;
}

.input-wrapper.hide-icon::before {
	visibility: hidden;
}

</style>