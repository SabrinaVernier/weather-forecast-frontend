<script setup>
// import { RouterLink } from 'vue-router'
</script>

<template>
  <footer id="footer">
    <div class="container">
      <h2>
        Powered by <br /><a href="https://www.weatherapi.com/" title="Free Weather API"
          >WeatherAPI.com</a
        >
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
  color: white;
  letter-spacing: 1.2px;
}

footer > div {
  text-align: center;
  padding: 20px 0;
}
footer > div:first-child {
  border-bottom: 1px solid lightgray;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
  align-items: center;
}
a {
  text-decoration: none;
  font-weight: bold;
  font-family: Georgia, Times, 'Times New Roman', serif;
}
footer > div:first-child a {
  color: var(--green-api);
}
footer > div:last-child a {
  color: purple;
}
</style>
