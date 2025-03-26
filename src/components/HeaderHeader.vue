<script setup>
// import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div>
      <RouterLink :to="{ name: 'home' }">Météo du jour</RouterLink>
      <RouterLink :to="{ name: 'weather' }">Prévisions</RouterLink>
    </div>
  </header>
</template>
<style scoped>
header {
  height: 100px;
  width: 100vw;
  background-color: lightcoral;
  position: fixed;
  top: 0;
  z-index: 1;
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
