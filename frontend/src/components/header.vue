<script>
import AppLogo from './app-logo.vue'
import SearchBar from './search-bar.vue'
export default {
	name: 'AppHeader',
	components: {
		AppLogo,
		SearchBar
	}
}
</script>

<template lang="pug">
header(class="container")
	AppLogo(class="logo")
	SearchBar(class="search-bar")
	i(class="fa-solid fa-bars")
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
	justify-content: space-between;
  margin-top: 48px;
	color: var(--text-color);
}

.logo {
	flex-basis: 750px;
}

i {
	font-size: 1.5rem;
}
</style>