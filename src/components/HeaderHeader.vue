<script setup>
// import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div>
      <RouterLink :to="{ name: 'home' }">accueil</RouterLink>
      <RouterLink :to="{ name: 'weather' }">Météo</RouterLink>
      <RouterLink :to="{ name: 'login' }">Prévision</RouterLink>
    </div>
  </header>
</template>
<style scoped>
header {
  height: 100px;
  background-color: lightcoral;
}

header > div {
  display: flex;
  gap: 20px;
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
</style>
