<script setup>
// import { RouterLink } from 'vue-router'

import { onMounted, ref, computed } from 'vue'
import L from 'leaflet' // ✅ Import de Leaflet
import 'leaflet/dist/leaflet.css' // ✅ Import du CSS de Leaflet

import axios from 'axios'

let map = ref(null)
const currentWeather = ref(null)
const currentMarker = ref(null)
const city = ref('')
const errorMessage = ref('')

const cityInfos = ref('') // Stocke les infos de la ville
const weatherCondition = ref('') // Stocke la météo actuelle
const backgroundImage = ref('') // Stocke l'image de fond
const backgroundDiv = ref('') // Stocke l'image de fond

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
      `http://api.weatherapi.com/v1/current.json?key=${key}&q=Narbonne&aqi=yes&lang=fr&alerts=yes`,
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
  } catch (error) {
    console.log('error onmounted catch>>>', error)
  }
})

// fonction déclenchée par le formulaire-------------------------------------
const prevWeather = async () => {
  currentWeather.value = null

  const url = 'http://api.weatherapi.com/v1'

  const key = 'da3c0767563b48ddb4f160425252003'

  try {
    // 🔥 Récupération des coordonnées et icônes météo
    const response = await axios.get(
      `${url}/current.json?key=${key}&q=${city.value}&aqi=yes&lang=fr&alerts=yes`,
    )
    console.log('data>>>', response.data)
    // currentWeather.value = data

    const data = response.data
    currentWeather.value = data
    const { lat, lon } = data.location
    const weatherIcon = 'https:' + data.current.condition.icon

    console.log('location>>', data.location)
    console.log('icon>>', weatherIcon)

    weatherCondition.value = data.current.condition.text
    cityInfos.value = data.location
    updateBackground(weatherCondition.value)

    // 🔹 Ajout d'un marqueur avec icône météo
    const weatherMarker = L.icon({
      iconUrl: weatherIcon,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    })

    L.marker([lat, lon], { icon: weatherMarker })
      .addTo(map.value)
      .bindPopup(`🌤️ ${data.location.name} - ${data.current.temp_c}°C`)
      .openPopup()
  } catch (error) {
    errorMessage.value = "❌ Ville non trouvée ! Veuillez vérifier l'orthographe"
    console.log('error prevweather catch>>>', error)
  }
}

// coordonnées au clic sur carte---------------------------------------------
// 📌 Fonction déclenchée au clic sur la carte
const onMapClick = (e) => {
  if (!e || !e.latlng) {
    console.error('❌ Erreur : Événement de clic non valide', e)
    return
  }

  // 🔥 Supprimer le précédent marqueur s'il existe
  if (currentMarker.value) {
    map.value.removeLayer(currentMarker.value)
  }
  // alert(`📍 Vous avez cliqué sur : ${e.latlng.lat}, ${e.latlng.lng}`)

  // Ajouter un marqueur à l'endroit cliqué
  currentMarker.value = L.marker([e.latlng.lat, e.latlng.lng])
    .addTo(map.value)
    .bindPopup(`📍 Marqueur : ${e.latlng.lat}, ${e.latlng.lng}`)
    .openPopup()
}

onMounted(() => {
  // 🔥 Initialiser la carte uniquement si elle n'existe pas encore
  if (!map.value) {
    map.value = L.map('map').setView([43.184277, 3.003078], 10) // Narbonne

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.value)
  }

  // 🔥 Vérifier que `map.value` est bien défini avant d'attacher l'événement
  if (map.value) {
    map.value.on('click', (event) => onMapClick(event)) // ✅ Passer `event` explicitement
  }
})

// ---fonction pour avoir date au bon format--------
const goodDate = computed(() => {
  const date = cityInfos.value.localtime
  const hour = date.split(' ')[1]

  return date.split(' ')[0].split('-').reverse().join('/') + ' ' + hour
})
</script>

<template>
  <main>
    <div class="top-div">
      <h1>Météo</h1>

      <h2>Quel temps fait-il aujourd'hui ?</h2>

      <div class="search">
        <section class="search-by-city">
          <p>recherche par ville :</p>
          <form @submit.prevent="prevWeather">
            <label>
              <input
                type="text"
                v-model="city"
                name="city"
                placeholder="Paris"
                @click="errorMessage = ''"
            /></label>
            <button>Rechercher</button>
          </form>
        </section>

        <section class="search-by-map">
          <p>Recherche sur la carte :</p>
          <div id="map"></div>
        </section>
      </div>
    </div>

    <div class="bottom-div">
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
                  <font-awesome-icon :icon="['fas', 'tint']" />
                  {{ currentWeather.current.humidity }} mm
                </p>
                <p>
                  <font-awesome-icon :icon="['fas', 'wind']" />
                  {{ currentWeather.current.wind_kph }} km/h
                </p>
                <p>
                  <font-awesome-icon :icon="['fas', 'location-arrow']" />
                  {{ currentWeather.current.wind_dir }}
                </p>
                <p>
                  <font-awesome-icon :icon="['fas', 'star']" />
                  {{ currentWeather.current.air_quality.usEpaIndex }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-map">
        <div v-if="currentWeather">
          <div class="détails">
            <p>Ville : {{ currentWeather.location.name }}</p>
            <p>Région : {{ currentWeather.location.region }}</p>
            <p>Pays : {{ currentWeather.location.country }}</p>
            <p>
              Coordonnées : latitude {{ currentWeather.location.lat }} et longitude
              {{ currentWeather.location.lon }}
            </p>
            <p>Heure : {{ currentWeather.location.localtime }}</p>
          </div>

          <div class="weather">
            <img :src="currentWeather.current.condition.icon" alt="icon weather" />
            <p>Temps actuel : {{ currentWeather.current.condition.text }}</p>
            <p>Tempétature : {{ currentWeather.current.temp_c }} °C</p>
            <p>Ressenti : {{ currentWeather.current.windchill_c }} °C</p>
            <p>
              Vent : vitesse {{ currentWeather.current.wind_kph }} Km/h et direction
              {{ currentWeather.current.wind_dir }}
            </p>
            <p>Rafale: {{ currentWeather.current.gust_kph }} Km/h</p>
            <p>Précipitation : {{ currentWeather.current.precip_mm }} mm</p>
            <p>Humidité : {{ currentWeather.current.humidity }} mm</p>
            <p>Couverture nuageuse : {{ currentWeather.current.cloud }} %</p>
            <p>Indice UV : {{ currentWeather.current.uv }}</p>

            <p>Dernière mise à jour : {{ currentWeather.current.last_updated }}</p>
            <p>Jour : {{ currentWeather.current.is_day }} (1=oui, 0=non)</p>
            <p>
              Qualité de l'air : {{ currentWeather.current.air_quality.index_us_epa }} (1 signifie
              Bon 2 signifie Modéré 3 signifie malsain pour le groupe sensible 4 signifie malsain 5
              signifie très malsain 6 signifie dangereux)
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
<style scoped>
main {
  background-color: black;
  padding: 20px 50px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  min-height: 100vh;
}

main > div {
  background-color: #fff;
}

section {
  flex: 1;
  padding: 20px;
  border: 1px solid #000;
}
strong {
  font-weight: bold;
}
/* ---search---------- */

.search {
  display: flex;
  height: fit-content;
}

.search-by-city {
  flex: 1;
}
.search-by-map {
  flex: 2;
}
/* ----map------------ */
#map {
  width: 400px;
  height: 300px;
  border-radius: 10px;
  margin-left: 200px;
  /* scale: 50%; */
}

/* -----response-------- */
.result {
  height: 500px;
  border: 5px solid plum;
}

.weather-container {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background 0.5s ease-in-out;
  display: flex;
  position: relative;
}

/* ---div-absolute-------- */

.div-absolute {
  border: 1px solid plum;
  border-radius: 20px;
  padding: 20px;
  height: fit-content;
  position: absolute;
  top: 100px;
  left: 150px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
  color: white;
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

/* ---errorMessage */
.error-message {
  color: red;
  margin-top: 50px;
}
</style>
