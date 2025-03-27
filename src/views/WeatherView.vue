<script setup>
// import { RouterLink } from 'vue-router'

import { ref } from 'vue'

import axios from 'axios'

const currentWeather = ref(null)
const displayPerHour = ref(false)
const dayIndex = ref(null)
const city = ref('Narbonne')
const days = ref(3)
const qualityAirValue = ref('')
const backgroundColor = ref('')

const prevWeather = async () => {
  const url = 'http://api.weatherapi.com/v1'

  const key = 'da3c0767563b48ddb4f160425252003'

  try {
    const { data } = await axios.get(
      `${url}/forecast.json?key=${key}&q=${city.value}&lang=fr&aqi=yes&days=${days.value}`,
    )
    console.log('data>>>', data)
    currentWeather.value = data
  } catch (error) {
    console.log('error catch>>>', error)
  }
}

const indexDay = (index) => {
  displayPerHour.value = true
  dayIndex.value = index
}

// ✅ Fonction pour changer la couleur de fond selon la météo
const updateBackground = (condition) => {
  if (condition.toLowerCase().includes('pluie')) {
    backgroundColor.value = 'rgb(154, 159, 162, 0.3)'
  } else if (condition.toLowerCase().includes('neige')) {
    backgroundColor.value = 'rgb(184, 200, 229, 0.3)'
  } else if (condition.toLowerCase().includes('brume')) {
    backgroundColor.value = 'rgb(165, 193, 233, 0.3)'
  } else if (condition.toLowerCase().includes('orage')) {
    backgroundColor.value = 'rgb(85, 72, 90, 0.3)'
  } else if (
    condition.toLowerCase().includes('nuageux') ||
    condition.toLowerCase().includes('couvert')
  ) {
    backgroundColor.value = 'rgb(186, 187, 187, 0.3)'
  } else if (condition.toLowerCase().includes('soleil')) {
    backgroundColor.value = 'rgb(36, 106, 196, 0.3)'
  } else {
    backgroundColor.value = 'rgb(255, 255, 255)' // 🌞 Par défaut, ciel dégagé
  }
}

// ---fonction pour avoir date au bon format--------
const goodDate = (date) => {
  return date.split(' ')[0].split('-').reverse().splice(0, 2).join('/')
}

// ---fonction pour avoir date au bon format avec heure--------
const goodDateHour = (date) => {
  return date.split(' ')[0].split('-').reverse().join('/')
}

const justHour = (hour) => {
  return hour.split(' ')[1]
}

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

// ---fontion pour connaitre le jour de la semaine-----
const whatDay = (date) => {
  const dayDate = new Date(date)
  const dayNumber = dayDate.getDay()
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  return dayNames[dayNumber]
}
</script>

<template>
  <main>
    <div class="container">
      <h1>Prévisions</h1>

      <section class="search">
        <h2 class="text-slide">=> Quel temps fera-t'il ?</h2>
        <form @submit.prevent="prevWeather">
          <label
            >Ville :
            <input
              type="text"
              v-model="city"
              name="city"
              placeholder="Paris"
              @input="currentWeather = null"
          /></label>
          <label
            >Combien de jours :
            <input
              type="number"
              v-model="days"
              name="days"
              placeholder="3"
              @input="currentWeather = null"
          /></label>
          <button>Prévisions</button>
        </form>
      </section>

      <h3>Prévisions par jour</h3>
      <section v-if="currentWeather" class="forecast">
        <div
          class="per-day"
          @click="indexDay(currentWeather.forecast.forecastday.indexOf(day))"
          v-for="day in currentWeather.forecast.forecastday"
          :key="day"
          :style="{ backgroundColor: updateBackground(day.day.condition.text) }"
        >
          <!-- <p>{{ currentWeather.forecast.forecastday.indexOf(day) }}</p> -->
          <p class="text-align p1">{{ whatDay(day.date) }}</p>
          <p class="text-align p2">{{ goodDate(day.date) }}</p>
          <p class="text-align p3">{{ day.day.condition.text }}</p>
          <img :src="day.day.condition.icon" alt="icon weather" />
          <div>
            <p>
              <font-awesome-icon :icon="['fas', 'thermometer-three-quarters']" />{{
                day.day.maxtemp_c
              }}
              °C
            </p>
            <p>
              <font-awesome-icon :icon="['fas', 'thermometer-quarter']" />{{ day.day.mintemp_c }} °C
            </p>
          </div>
          <div>
            <p><font-awesome-icon :icon="['fas', 'wind']" />{{ day.day.maxwind_kph }} km/h</p>
          </div>
          <div>
            <p>
              <font-awesome-icon :icon="['fas', 'cloud-rain']" />{{ day.day.totalprecip_mm }} mm
            </p>
            <p><font-awesome-icon :icon="['fas', 'tint']" />{{ day.day.avghumidity }} %</p>
          </div>
          <div>
            <p>
              <font-awesome-icon :icon="['fas', 'star']" /> air
              {{ airQuality(day.day.air_quality['us-epa-index']) }}
            </p>
          </div>
        </div>
      </section>

      <section class="result">
        <h3>Prévisions (par heure) du jour choisi</h3>
        <div v-if="currentWeather && displayPerHour">
          <div
            class="per-hour"
            :class="{ nightBackground: hour.is_day === 0, dayBackground: hour.is_day === 1 }"
            v-for="hour in currentWeather.forecast.forecastday[dayIndex].hour"
            :key="hour"
          >
            <p>{{ goodDateHour(hour.time) }}</p>
            <p>{{ justHour(hour.time) }}</p>
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
    </div>
  </main>
</template>
<style scoped>
main {
  background-image: url('../assets/Imgs/N-nature-verte6.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* ---form------- */
form label {
  margin-right: 20px;
}
form input {
  border-radius: 5px;
  padding: 5px;
  height: 30px;
}
form button {
  background: linear-gradient(
    10deg,
    var(--green-light),
    var(--green-api),
    var(--green-back),
    var(--green-dark)
  );
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 15px;
  margin-left: 30px;
  border-radius: 10px;
  border: none;
}
/* ---forecast--- */
.forecast {
  display: flex;
  gap: 10px;
}
.forecast > div {
  border: 1px solid darkseagreen;
  background-color: var(--blue-light);
  border-radius: 20px;
  padding: 20px;
}

/* --per-day */
.per-day img {
  padding: 20px 0;
}
.per-day svg {
  font-size: 12px;
  margin-right: 10px;
  color: white;
}
.per-day > div {
  color: white;
  font-size: 14px;
  margin-bottom: 5px;
}
.text-align {
  text-align: center;
}
.p1 {
  margin-bottom: 10px;
  font-size: 20px;
}
/* ---per-hour */

.result {
  height: 200px;
  margin: 50px 0;
  /* border: 5px solid plum; */
}

.result > div {
  display: flex;
  gap: 5px;
  overflow: scroll;
}

.result > div > div {
  border: 1px solid #000;
  border-radius: 10px;
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

/* ---animation---------------- */
@keyframes slideInOut {
  0% {
    transform: translateX(-50px);
    opacity: 0;
  }
  50% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(50px);
    opacity: 0;
  }
}

.text-slide {
  font-size: 24px;
  font-weight: bold;
  animation: slideInOut 3s infinite;
}
</style>
