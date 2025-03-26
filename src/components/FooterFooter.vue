<script setup>
// import { RouterLink } from 'vue-router'
</script>

<template>
  <footer>
    <div>
      <h2>
        Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
      </h2>

      <a href="https://www.weatherapi.com/" title="Free Weather API"
        ><img
          src="//cdn.weatherapi.com/v4/images/weatherapi_logo.png"
          alt="Weather data by WeatherAPI.com"
      /></a>
    </div>
    <div>
      <p>Réalisé par <a href="">Sabrina Vernier</a> avec <a href="">Vue.js</a></p>
    </div>
  </footer>
</template>
<style scoped>
footer {
  height: fit-content;
  background-color: lightsteelblue;
}

footer > div {
  text-align: center;
  padding: 20px 0;
}
footer > div:first-child {
  border-bottom: 1px solid white;
}
</style>
