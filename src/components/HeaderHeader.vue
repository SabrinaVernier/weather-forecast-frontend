<script setup>
// import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <RouterLink :to="{ name: 'home' }">Météo du jour</RouterLink>
      <RouterLink :to="{ name: 'weather' }">Prévisions</RouterLink>
    </div>
  </header>
</template>
<style scoped>
header {
  height: 100px;
  width: 100vw;
  background-color: var(--green-back);
  position: fixed;
  top: 0;
  z-index: 10;
}

header > div {
  display: flex;
  gap: 100px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

header > div a {
  font-family: system-ui, sans-serif;
  font-size: 20px;
  color: white;
  font-weight: bold;
  text-decoration: none;
  text-transform: uppercase;
}

.container {
  background-color: var(--green-back);
}

.router-link-exact-active {
  color: yellow;
}
</style>
