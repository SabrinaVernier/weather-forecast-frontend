<script setup>
import { RouterLink } from 'vue-router'

import { ref } from 'vue'

import axios from 'axios'

const currentWeather = ref(null)
const city = ref('')

const prevWeather = async () => {
  const url = 'http://api.weatherapi.com/v1'

  const key = '64f1ff20bec645efa8e125615252003'

  try {
    const { data } = await axios.get(`${url}/current.json?key=${key}&q=${city.value}&lang=fr`)
    console.log('data>>>', data)
    currentWeather.value = data
  } catch (error) {
    console.log('error catch>>>', error)
  }
}
</script>

<template>
  <main>
    <section class="home">
      <RouterLink :to="{ name: 'home' }">go to Home Page</RouterLink>
    </section>

    <section class="search">
      <h1>Quel temps fera-t'il ?</h1>
      <form @submit.prevent="prevWeather">
        <label> <input type="text" v-model="city" name="city" placeholder="Paris" /></label>
        <button>Rechercher</button>
      </form>
    </section>

    <section class="result">
      <div class="response" v-if="currentWeather">
        <p>{{ currentWeather.current.condition.text }}</p>
        <img :src="currentWeather.current.condition.icon" alt="icon" />
        <p>Température{{ currentWeather.current.temp_c }}°C</p>
        <p>Ressenti{{ currentWeather.current.windchill_c }}°C</p>
        <p>Vent {{ currentWeather.current.wind_kph }} Km / h</p>
        <p>Rafale {{ currentWeather.current.gust_kph }} Km / h</p>
        <p>Vitesse vent{{ currentWeather.current.wind_degree }} direction</p>
        <p>Humidité {{ currentWeather.current.humidity }} %</p>
        <p>Précipitation{{ currentWeather.current.precip_mm }} mm</p>
        <p>Jour {{ currentWeather.current.is_day }} (1-oui, 0-non)</p>
      </div>
    </section>
  </main>
</template>
<style scoped>
main {
  padding: 100px;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.response {
  height: 200px;
  margin-top: 100px;
  border: 5px solid plum;
}
</style>
