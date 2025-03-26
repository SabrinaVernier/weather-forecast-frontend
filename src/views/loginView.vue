<script setup>
import { RouterLink } from 'vue-router'

import { ref, computed } from 'vue'

import axios from 'axios'

const currentWeather = ref(null)
const displayPerHour = ref(false)
const dayIndex = ref(null)
const city = ref('Narbonne')
const days = ref(3)
const qualityAirValue = ref('')

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

// ---fonction pour avoir date au bon format--------
const goodDate = computed(() => {
  let date = ''

  for (const day of currentWeather.value.forecast.forecastday) {
    // console.log(day.date)
    date = day.date
  }
  return date.split(' ')[0].split('-').reverse().join('/')
})

// ---fonction pour avoir date au bon format avec heure--------
const goodDateHour = computed(() => {
  let date = ''
  let hour = ''

  console.log(currentWeather.value.forecast.forecastday[dayIndex.value].hour)
  console.log(dayIndex.value)

  for (const day of currentWeather.value.forecast.forecastday[dayIndex.value].hour) {
    // console.log(day.time)
    date = day.time
    hour = day.time.split(' ')[1]
  }
  return date.split(' ')[0].split('-').reverse().join('/') + ' ' + hour
})

// ---fonction pour connaitre la qualité de l'air à partir de l'index----
const airQuality = (index) => {
  if (index === 1) {
    qualityAirValue.value = 'Bon'
  } else if (index === 2) {
    qualityAirValue.value = 'Modéré'
  } else if (index === 3) {
    qualityAirValue.value = 'Légèrement malsain'
  } else if (index === 4) {
    qualityAirValue.value = 'Malsain'
  } else if (index === 5) {
    qualityAirValue.value = 'Très malsain'
  } else {
    qualityAirValue.value = 'Dangereux'
  }

  return qualityAirValue.value
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
        class="per day"
        @click="indexDay(currentWeather.forecast.forecastday.indexOf(day))"
        v-for="day in currentWeather.forecast.forecastday"
        :key="day"
      >
        <p>{{ currentWeather.forecast.forecastday.indexOf(day) }}</p>
        <p>{{ goodDate }}</p>
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
        <p>qualité air {{ airQuality(day.day.air_quality['us-epa-index']) }}</p>
      </div>
    </section>

    <section class="result">
      <div v-if="currentWeather && displayPerHour">
        <div
          class="per-hour"
          :class="{ nightBackground: hour.is_day === 0, dayBackground: hour.is_day === 1 }"
          v-for="hour in currentWeather.forecast.forecastday[dayIndex].hour"
          :key="hour"
        >
          <p>{{ goodDateHour }}</p>
          <p>{{ hour.condition.text }}</p>
          <img :src="hour.condition.icon" alt="icon weather" />
          <p>{{ hour.temp_c }} °C</p>
          <p>{{ hour.wind_kph }} km/h</p>
          <p>rafale {{ hour.gust_kph }} km/h</p>
          <p>{{ hour.wind_dir }}</p>
          <p>{{ hour.precip_mm }} mm</p>
          <p>{{ hour.humidity }} %</p>
          <p>qualité air {{ airQuality(hour.air_quality['gb-defra-index']) }}</p>
          <!-- <p>{{ hour.is_day }}</p> -->
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

.result {
  height: 200px;
  margin-top: 100px;
  border: 5px solid plum;
}

.result > div {
  display: flex;
  overflow: scroll;
}

.result > div > div {
  border: 1px solid #000;
  padding: 10px;
  flex-shrink: 0;
}

.nightBackground {
  background-color: #00008b;
  color: white;
}

.dayBackground {
  background-color: #fff8dc;
}
</style>
