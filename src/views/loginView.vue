<script setup>
import { RouterLink } from 'vue-router'

import { ref } from 'vue'

import axios from 'axios'

const currentWeather = ref(null)
const displayPerHour = ref(false)
const dayIndex = ref(null)
const city = ref('')
const days = ref(1)

const prevWeather = async () => {
  const url = 'http://api.weatherapi.com/v1'

  const key = 'da3c0767563b48ddb4f160425252003'

  try {
    const { data } = await axios.get(
      `${url}/forecast.json?key=${key}&q=${city.value}&lang=fr&aqi=yes&days=${days.value}`,
    )
    console.log('data>>>', data)
    currentWeather.value = data
    // hourForecast.value = currentWeather.value.forecast.forecastday
  } catch (error) {
    console.log('error catch>>>', error)
  }
}

const indexDay = (index) => {
  displayPerHour.value = true
  dayIndex.value = index
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
        <label>Ville : <input type="text" v-model="city" name="city" placeholder="Paris" /></label>
        <label
          >Combien de jours : <input type="number" v-model="days" name="days" placeholder="3"
        /></label>
        <button>Rechercher</button>
      </form>
    </section>

    <section v-if="currentWeather" class="forecast">
      <div
        @click="indexDay(currentWeather.forecast.forecastday.indexOf(day))"
        v-for="day in currentWeather.forecast.forecastday"
        :key="day"
      >
        <div class="per day">
          <p>{{ currentWeather.forecast.forecastday.indexOf(day) }}</p>
          <p>{{ day.date }}</p>
          <p>{{ day.day.condition.text }}</p>
          <img :src="day.day.condition.icon" alt="icon weather" />
          <div>
            <p>{{ day.day.maxtemp_c }} °C /</p>
            <p>{{ day.day.mintemp_c }} °C</p>
          </div>
          <div>
            <p>{{ day.day.maxwind_kph }} km/h</p>
          </div>
          <div>
            <p>{{ day.day.totalprecip_mm }} mm</p>
            <p>{{ day.day.avghumidity }} %</p>
          </div>
        </div>

        <!-- <div class="per-hour result" v-if="displayPerHour">
          <div v-for="hour in currentWeather.forecast.forecastday[dayIndex].hour" :key="hour">
            <p>{{ hour.time }}</p>
          </div>
        </div> -->
      </div>
    </section>

    <section class="result">
      <div class="per-hour" v-if="currentWeather && displayPerHour">
        <div v-for="hour in currentWeather.forecast.forecastday[dayIndex].hour" :key="hour">
          <p>{{ hour.time }}</p>
        </div>
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

.result {
  height: 200px;
  margin-top: 100px;
  border: 5px solid plum;
}

/* ---forecast--- */
.forecast {
  display: flex;
  gap: 10px;
}
.forecast > div {
  border: 1px solid darkseagreen;
  padding: 20px;
}

/* --per-day */

/* ---per-hour */
/* .per-hour {
  display: none;
} */
</style>
