<script setup>
import { RouterLink } from 'vue-router'

import { onMounted, ref, computed } from 'vue'
import L from 'leaflet' // ✅ Import de Leaflet
import 'leaflet/dist/leaflet.css' // ✅ Import du CSS de Leaflet

import axios from 'axios'

let map = ref(null)
const currentWeather = ref(null)
const currentMarker = ref(null)
const city = ref('')
const zipCode = ref('')
const errorMessage = ref('')
const errorImage = ref('')

const cityInfos = ref('') // Stocke les infos de la ville
const latLong = ref('')
const weatherCondition = ref('') // Stocke la météo actuelle
const backgroundImage = ref('') // Stocke l'image de fond
const backgroundDiv = ref('') // Stocke la couleur de fond
const qualityAirValue = ref('')
// const cityImage = ref(null)
const urlImage = ref('')
const urlArrayImage = ref(null)

// ✅ Fonction pour changer l'image de fond selon la météo
const updateBackground = (condition) => {
  if (condition.toLowerCase().includes('pluie')) {
    ;(backgroundImage.value =
      "url('https://www.shutterstock.com/image-photo/heavy-rain-on-sky-clouds-600nw-2481740779.jpg')"),
      (backgroundDiv.value = 'rgb(154, 159, 162, 0.3)')
  } else if (condition.toLowerCase().includes('neige')) {
    ;(backgroundImage.value =
      "url('https://upload.wikimedia.org/wikipedia/commons/9/9e/D%C3%BCsseldorf_Hofgarten_2009.jpg')"),
      (backgroundDiv.value = 'rgb(184, 200, 229, 0.3)')
  } else if (condition.toLowerCase().includes('brume')) {
    ;(backgroundImage.value =
      "url('https://www.francebleu.fr/s3/cruiser-production-eu3/2024/11/741ee1b6-0dc5-489f-baae-0610a1684d50/1200x680_sc_maxstockworld466881.jpg')"),
      (backgroundDiv.value = 'rgb(165, 193, 233, 0.3)')
  } else if (condition.toLowerCase().includes('orage')) {
    ;(backgroundImage.value =
      "url('https://www.infoclimat.fr/photolive/photos/2013-07/203691160720132251.jpg')"),
      (backgroundDiv.value = 'rgb(85, 72, 90, 0.3)')
  } else if (condition.toLowerCase().includes('nuageux')) {
    ;(backgroundImage.value = "url('https://static.actu.fr/uploads/2020/01/nuages.jpg')"),
      (backgroundDiv.value = 'rgb(186, 187, 187, 0.3)')
  } else {
    ;(backgroundImage.value =
      "url('https://images.lesindesradios.fr/fit-in/1100x2000/filters:format(webp)/medias/Vsj0LZpM34/image/sun-3588618_19201633764378538.jpg')"),
      (backgroundDiv.value = 'rgb(36, 106, 196, 0.3)') // 🌞 Par défaut, ciel dégagé
  }
}

// Hook d'initialisation de la carte-----------------------------------------
onMounted(async () => {
  // const map = L.map('map').setView([48.8566, 2.3522], 10) // Paris par défaut
  map.value = L.map('map').setView([43.1833, 3.0], 10) // Narbonne par défaut

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value)

  try {
    const key = 'da3c0767563b48ddb4f160425252003'
    // 🔥 Récupération des coordonnées et icônes météo
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=Narbonne&aqi=yes&lang=fr&alerts=yes`,
    )
    const data = await response.json()

    currentWeather.value = data
    console.log('currentweather>>>', currentWeather.value)

    const { lat, lon } = data.location
    const weatherIcon = 'https:' + data.current.condition.icon

    console.log('location>>', { lat, lon })
    console.log('icon>>', weatherIcon)

    weatherCondition.value = data.current.condition.text
    cityInfos.value = data.location
    updateBackground(weatherCondition.value)

    // // 🔹 Ajout d'un marqueur avec icône météo
    const weatherMarker = L.icon({
      iconUrl: weatherIcon,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    })

    L.marker([lat, lon], { icon: weatherMarker })
      .addTo(map.value)
      .bindPopup(`⭐️ ${data.location.name} - ${data.current.temp_c}°C`)
      .openPopup()

    // 🔥 Vérifier que `map.value` est bien défini avant d'attacher l'événement
    if (map.value) {
      map.value.on('click', (event) => onMapClick(event)) // ✅ Passer `event` explicitement
    }
  } catch (error) {
    console.log('error onmounted catch>>>', error)
  }
})

// fonction déclenchée par le formulaire-------------------------------------
const prevWeather = async () => {
  urlArrayImage.value = []
  currentWeather.value = null

  const url = 'https://api.weatherapi.com/v1'

  const key = 'da3c0767563b48ddb4f160425252003'

  if (city.value && !zipCode.value) {
    try {
      city.value = `${city.value},FR`
      // 🔥 Récupération des coordonnées et icônes météo
      const { data } = await axios.get(
        `${url}/current.json?key=${key}&q=${city.value}&aqi=yes&lang=fr&alerts=yes`,
      )
      console.log('data>>>', data)
      currentWeather.value = data
      const { lat, lon } = data.location
      const weatherIcon = 'https:' + data.current.condition.icon

      console.log('location>>', data.location)
      console.log('icon>>', weatherIcon)

      weatherCondition.value = data.current.condition.text
      cityInfos.value = data.location
      updateBackground(weatherCondition.value)
      city.value = city.value.slice(0, city.value.length - 3)

      // 🔹 Ajout d'un marqueur avec icône météo
      const weatherMarker = L.icon({
        iconUrl: weatherIcon,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
      })

      L.marker([lat, lon], { icon: weatherMarker })
        .addTo(map.value)
        .bindPopup(`⭐️ ${data.location.name} - ${data.current.temp_c}°C`)
        .openPopup()
    } catch (error) {
      errorMessage.value = "❌ Ville non trouvée ! Veuillez vérifier l'orthographe"
      console.log('error prevweather catch>>>', error)
    }
  } else if (!city.value && zipCode.value) {
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
    errorMessage.value = 'Veuillez remplir un des champs !'
  } else {
    errorMessage.value = 'Veuillez entrer un nom OU un code postal'
  }
}

// 📌 Fonction déclenchée au clic sur la carte
const onMapClick = async (e) => {
  city.value = ''
  if (!e || !e.latlng) {
    console.error('❌ Erreur : Événement de clic non valide', e)
    return
  }

  // 🔥 Supprimer le précédent marqueur s'il existe
  if (currentMarker.value) {
    map.value.removeLayer(currentMarker.value)
  }

  try {
    latLong.value = `${e.latlng.lat},${e.latlng.lng}`
    console.log('latLong>>>', latLong.value)

    currentWeather.value = null
    urlArrayImage.value = []

    const url = 'https://api.weatherapi.com/v1'

    const key = 'da3c0767563b48ddb4f160425252003'
    // 🔥 Récupération des coordonnées et icônes météo
    const response = await axios.get(
      `${url}/current.json?key=${key}&q=${latLong.value}&aqi=yes&lang=fr&alerts=yes`,
    )
    console.log('data>>>', response.data)
    // currentWeather.value = data

    const data = response.data
    currentWeather.value = data
    city.value = data.location.name
    // const { lat, lon } = data.location
    const weatherIcon = 'https:' + data.current.condition.icon

    console.log('location>>', data.location)
    console.log('icon>>', weatherIcon)

    weatherCondition.value = data.current.condition.text
    cityInfos.value = data.location
    updateBackground(weatherCondition.value)

    // Ajouter un marqueur à l'endroit cliqué
    currentMarker.value = L.marker([e.latlng.lat, e.latlng.lng])
      .addTo(map.value)
      .bindPopup(`📍 ${data.location.name} - ${data.current.temp_c}°C`)
      .openPopup()
  } catch (error) {
    console.log('error catch click>>>', error)
  }
}

// ---fonction pour avoir date au bon format--------
const goodDate = computed(() => {
  const date = cityInfos.value.localtime
  const hour = date.split(' ')[1]

  return date.split(' ')[0].split('-').reverse().join('/') + ' ' + hour
})

const updateDate = computed(() => {
  const date = currentWeather.value.current.last_updated
  const hour = date.split(' ')[1]
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

// ---fonction pour obtenir les noms d'images de la ville------
const getCityImage = async () => {
  try {
    errorImage.value = ''
    const accessKey = 'TUeT7BZVWBAdhFowpcRlOYJICqIDDiZ35j_KDaFRnok' // Remplace par ta clé API

    const { data } = await axios.get(
      `https://api.unsplash.com/search/photos?query=${city.value}&client_id=${accessKey}&per_page=20&orientation=landscape`,
    )

    console.log('data getcityimage>>>', data)
    if (data.results.length === 0) {
      console.log('aucune image trouvée')
      errorImage.value = 'Aucune image trouvée'
    } else if (data.results.length === 1) {
      urlImage.value = data.results[0].urls.regular
    } else if (data.results.length > 1) {
      urlArrayImage.value = data.results
      console.log('arrayUrl>>>', urlArrayImage.value)
    } else {
      console.log('Un problème est survenu, veuillez réessayer...')
      errorImage.value = 'Un problème est survenu, veuillez réessayer...'
    }
  } catch (error) {
    console.log('error catch infoCity>>>', error)
  }
}
</script>

<template>
  <main id="main-homeview">
    <div class="container" id="container">
      <h1 class="first-h1">Météo du jour</h1>

      <h2 class="text-animation text-slide">=> Quel temps fait-il aujourd'hui ?</h2>
      <h3>
        <RouterLink :to="{ name: 'weather' }"
          >accéder aux prévisions des jours à venir...</RouterLink
        >
      </h3>
      <div class="top-div">
        <div class="search">
          <section class="search-by-city">
            <h4>Recherche par VILLE</h4>
            <form @submit.prevent="prevWeather">
              <label
                >Name :
                <input
                  type="text"
                  v-model="city"
                  name="city"
                  placeholder="Narbonne"
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
                  @click="((errorMessage = ''), (city = ''))"
              /></label>
              <button>Rechercher</button>
            </form>
          </section>

          <section class="search-by-map">
            <h4>Recherche sur la CARTE</h4>
            <div id="map"></div>
          </section>
        </div>
        <section class="section-weather">
          <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>

          <div v-else class="result">
            <div
              v-if="currentWeather"
              class="weather-container"
              :style="{ backgroundImage: backgroundImage }"
            >
              <div class="div-absolute" :style="{ backgroundColor: backgroundDiv }">
                <div class="first-div">
                  <h2>
                    <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
                    <strong>{{ cityInfos.name }}</strong
                    >, <span>{{ cityInfos.region }}</span
                    >, {{ cityInfos.country }}
                  </h2>
                  <p><font-awesome-icon :icon="['far', 'calendar']" /> {{ goodDate }}</p>
                </div>

                <div class="second-div">
                  <div class="temp">
                    <img :src="currentWeather.current.condition.icon" alt="icon weather" />
                    <h1 v-if="currentWeather.current.temp_c >= 15">
                      <font-awesome-icon :icon="['fas', 'thermometer-three-quarters']" />
                      <strong>{{ currentWeather.current.temp_c }}</strong> °C
                    </h1>
                    <h1 v-else-if="currentWeather.current.temp_c >= 5">
                      <font-awesome-icon :icon="['fas', 'thermometer-half']" />
                      <strong>{{ currentWeather.current.temp_c }}</strong> °C
                    </h1>
                    <h1 v-else>
                      <font-awesome-icon :icon="['fas', 'thermometer-quarter']" />
                      <strong>{{ currentWeather.current.temp_c }}</strong> °C
                    </h1>
                  </div>
                  <p>
                    <em>{{ currentWeather.current.condition.text }}</em>
                  </p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'thermometer-quarter']" /> ressenti
                    {{ currentWeather.current.windchill_c }} °C
                  </p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'sun']" /> indice uv :
                    {{ currentWeather.current.uv }}
                  </p>
                </div>

                <div class="third-div">
                  <p>
                    <font-awesome-icon :icon="['fas', 'cloud']" />
                    {{ currentWeather.current.cloud }} %
                  </p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'tint']" />
                    {{ currentWeather.current.humidity }} mm
                  </p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'cloud-rain']" />
                    {{ currentWeather.current.precip_mm }} mm
                  </p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'wind']" />
                    {{ currentWeather.current.wind_kph }} km/h
                  </p>
                  <p style="scale: 80%">(max : {{ currentWeather.current.gust_kph }} Km/h)</p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'location-arrow']" />
                    {{ currentWeather.current.wind_dir }}
                  </p>
                  <p>
                    <font-awesome-icon :icon="['fas', 'star']" />
                    {{ airQuality(currentWeather.current.air_quality['gb-defra-index']) }}
                  </p>
                </div>
              </div>

              <div class="fourth-div">
                <p>Dernière mise à jour : {{ updateDate }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="bottom-div" v-if="city">
        <section class="section-city">
          <h1 style="color: white">
            Visitez "<span class="span-city">{{
              `${city.slice(0, 1).toUpperCase()}${city.slice(1, city.length).toLowerCase()}`
            }}</span
            >"
          </h1>

          <div class="search-images">
            <button v-if="city" @click="getCityImage()">Images de la ville et les alentours</button>
          </div>

          <div v-if="urlImage && !urlArrayImage" id="image-container">
            <img :src="urlImage" alt="image de la ville" />
          </div>
          <div v-else-if="!urlImage && urlArrayImage" id="image-container">
            <div v-for="url in urlArrayImage" :key="url">
              <img :src="url.urls.regular" alt="images de la ville" />
            </div>
          </div>

          <p class="error-image" v-if="errorImage">{{ errorImage }}</p>
        </section>
      </div>
    </div>
  </main>
</template>
<style scoped>
main {
  background-image: url('../assets/Imgs/N-nature-verte4.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
.first-h1 {
  background-image: url('../assets/Imgs/N-nature-verte4.jpg');
  background-clip: text;
  color: transparent;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

main > div > div {
  background-color: var(--green-light);
  border: 10px groove var(--green-dark);
  border-radius: 10px;
  padding: 10px;
}

section {
  flex: 1;
  padding: 10px;
}
p {
  margin: 5px 0;
}
strong {
  font-weight: bold;
}
em {
  font-style: italic;
}
h3 {
  text-align: end;
}
h3 a {
  color: var(--blue-light);
  font-size: 16px;
  text-decoration: none;
}
h3 a:hover {
  color: var(--green-api);
  font-size: 20px;
}

/* ---TOP-DIV------------------- */
/* ---search---------- */
form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
form input {
  border-radius: 5px;
  padding: 5px;
  height: 30px;
  border-color: var(--yellow);
}
form .ou {
  font-style: italic;
  font-weight: bold;
  font-size: 20px;
  color: var(--green-back);
  align-self: center;
}
.top-div {
  display: flex;
}
.search {
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.search-by-city {
  flex: 1;
}
.search-by-map {
  flex: 1;
}
/* ---searc-img--- */

.search-images button,
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

.search-images {
  width: 100%;
  display: flex;
  justify-content: center;
}

.search-images button {
  margin: 20px 0;
}
/* ----map------------ */
#map {
  width: 300px;
  height: 300px;
  border-radius: 10px;
  margin: 10px auto;
  z-index: 1;
  /* scale: 50%; */
}

/* -----response-------- */

.weather-container {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  transition: background 0.5s ease-in-out;
  display: flex;
  position: relative;
  /* scale: 80%; */
}
.result {
  height: 100%;
  width: 100%;
}

/* ---div-absolute-------- */

.div-absolute {
  border-radius: 20px;
  padding: 20px;
  height: fit-content;
  min-width: 400px;
  position: absolute;
  top: 20px;
  left: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: flex-start;
  color: white;
  scale: 80%;
}

:is(.div-abolute p, .div-absolute h1, .div-absolute h2) {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 1.5px;
}
.div-absolute > div:not(:first-child) {
  align-self: flex-end;
}

.div-absolute svg {
  margin-right: 10px;
}
.first-div span {
  text-transform: uppercase;
}
.second-div .temp {
  display: flex;
}
.second-div .temp img {
  object-fit: cover;
}
.fourth-div {
  color: white;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

/* ---BOTTOM-DIV---------------- */
/* ---section city --------- */
.bottom-div {
  width: 100%;
}
.section-city {
  background-color: black;
  border-radius: 10px;
}
.span-city::first-letter {
  text-transform: uppercase;
}
#image-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
#image-container > div {
  flex-shrink: 0;
  width: calc((100% - 40px) / 5);
}
#image-container img {
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 15px;
  transition: transform 0.3s ease-in-out;
}

#image-container img:hover {
  transform: scale(2);
}

/* ---errorMessage */
.error-message {
  color: red;
  margin-top: 50px;
}

.error-image {
  color: white;
  font-size: 20px;
}

/* ---animation------------- */
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.text-animation {
  font-size: 24px;
  font-weight: bold;
  animation: fadeInOut 3s infinite; /* Animation infinie */
}
</style>
