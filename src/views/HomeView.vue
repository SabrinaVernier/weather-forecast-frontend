<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <h1>Homeview</h1>
    <RouterLink :to="{ name: 'login' }">go to login Page</RouterLink>
  </main>
  <footer>
    <p>
      Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
    </p>

    <a href="https://www.weatherapi.com/" title="Free Weather API"
      ><img
        src="//cdn.weatherapi.com/v4/images/weatherapi_logo.png"
        alt="Weather data by WeatherAPI.com"
    /></a>
  </footer>
</template>
<style scoped>
main {
  padding: 100px;
}
</style>
