<script setup>
// import { RouterLink } from 'vue-router'

import { ref } from 'vue'

import axios from 'axios'

const currentWeather = ref(null)
const displayPerHour = ref(false)
const dayIndex = ref(null)
const city = ref('')
const zipCode = ref('')
const days = ref(null)
const errorMessage = ref('')
const cityInfos = ref('') // Stocke les infos de la ville
const qualityAirValue = ref('')
const backgroundColor = ref('')

const prevWeather = async () => {
  errorMessage.value = ''
  const url = 'https://api.weatherapi.com/v1'

  const key = 'da3c0767563b48ddb4f160425252003'

  if (!days.value && (city.value || zipCode.value)) {
    errorMessage.value = 'Veuillez renseigner le nombre de jour !'
  } else if (days.value && city.value && !zipCode.value) {
    try {
      if (city.value.slice(city.value.length - 3, city.value.length) !== ',FR') {
        city.value = `${city.value},FR`
      }

      const { data } = await axios.get(
        `${url}/forecast.json?key=${key}&q=${city.value}&lang=fr&aqi=yes&days=${days.value}`,
      )
      console.log('data>>>', data)
      currentWeather.value = data
      cityInfos.value = data.location
    } catch (error) {
      console.log('error catch>>>', error)
    }
  } else if (days.value && !city.value && zipCode.value) {
    const geoApiKey = '24cecf305a964996b3f969c6da16bb03'
    zipCode.value = `${zipCode.value}, France`

    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${zipCode.value}&key=${geoApiKey}`,
      )

      console.log('data zip >>>', data)
      const cityZip = data.results[0].components.city
      console.log('cityzip>>>', cityZip)

      zipCode.value = ''
      city.value = cityZip
      prevWeather()
    } catch (error) {
      console.log('error catch zipcode>>>', error)
    }
  } else if (!zipCode.value && !city.value) {
    errorMessage.value = 'Veuillez remplir un des champs "Ville" ou "Code Postal"!'
  } else {
    errorMessage.value = 'Veuillez entrer un nom OU un code postal'
  }
}

// ---fonction pour connaître l'index du jour ----
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
  <main id="main-weatherview">
    <div class="container" id="container">
      <h1>Prévisions <br /><em>(jusqu'à 14 jours)</em></h1>

      <section class="search">
        <h2 class="text-slide">=> Quel temps fera-t'il ?</h2>
        <form @submit.prevent="prevWeather">
          <div>
            <label
              >Ville :
              <input
                type="text"
                v-model="city"
                name="city"
                placeholder="Paris"
                @input="currentWeather = null"
                @click="((errorMessage = ''), (zipCode = ''))"
            /></label>
            <p class="ou">OU</p>
            <label
              >Code Postal :
              <input
                type="text"
                v-model="zipCode"
                name="zipCode"
                placeholder="11100"
                @input="currentWeather = null"
                @click="((errorMessage = ''), (city = ''))"
            /></label>
          </div>
          <label
            >Combien de jours :
            <input
              type="number"
              v-model="days"
              name="days"
              placeholder="3"
              max="14"
              min="1"
              @input="currentWeather = null"
          /></label>
          <button>Prévisions</button>
        </form>

        <p class="error-message">{{ errorMessage }}</p>
      </section>

      <h3 v-if="cityInfos">
        Prévisions pour <strong>{{ cityInfos.name }}</strong
        >, <span class="span-uppercase">{{ cityInfos.region }}</span
        >,
        {{ cityInfos.country }}
      </h3>
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
        <h3>Prévisions par heure</h3>
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
h3 {
  color: var(--green-back);
}
em {
  font-style: italic;
  font-size: 20px;
  color: var(--green-api);
}

/* ---form------- */
form {
  display: flex;
  align-items: center;
}
form > div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
form .ou {
  font-style: italic;
  font-weight: bold;
  font-size: 20px;
  color: var(--green-back);
  align-self: center;
}
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
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #00008b rgb(68, 192, 233);
  gap: 20px;
}
.forecast > div {
  background-color: var(--blue-light);
  border-radius: 20px;
  padding: 20px;
}

/* --per-day */

.span-uppercase {
  text-transform: uppercase;
}
strong {
  font-weight: bold;
}
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
  height: fit-content;
  margin-top: 50px;
}

.result > div {
  display: flex;
  gap: 5px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(68, 192, 233) #00008b;
}

.result > div > div {
  /* border: 1px solid #000; */
  border-radius: 10px;
  padding: 10px;
  flex-shrink: 0;
}

.nightBackground {
  background-color: var(--blue-electric);
  color: white;
}

.dayBackground {
  background-color: var(--yellow-day);
}

/* ---errorMessage */
.error-message {
  color: red;
  font-size: 20px;
  margin-top: 50px;
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
