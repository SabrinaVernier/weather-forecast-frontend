<script setup>
// import { RouterLink } from 'vue-router'

import { onMounted, ref } from 'vue'
import L from 'leaflet' // ✅ Import de Leaflet
import 'leaflet/dist/leaflet.css' // ✅ Import du CSS de Leaflet

import axios from 'axios'

let map = ref(null)
const currentWeather = ref(null)
const currentMarker = ref(null)
const city = ref('')
const errorMessage = ref('')

// Hook d'initialisation de la carte-----------------------------------------
onMounted(async () => {
  // const map = L.map('map').setView([48.8566, 2.3522], 10) // Paris par défaut
  map.value = L.map('map').setView([43.1833, 3.0], 10) // Narbonne par défaut

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value)

  // Marqueur exemple
  currentMarker.value = L.marker([43.1833, 3.0])
    .addTo(map.value)
    .bindPopup('📍 Narbonne - Météo actuelle')
    .openPopup()

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

    // // 🔹 Ajout d'un marqueur avec icône météo
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

// return { map };
</script>

<template>
  <main>
    <div class="top-div">
      <h1>WeatherView</h1>

      <div class="search">
        <h2>Quel temps fait-il aujourd'hui ?</h2>
        <p>recherche par ville :</p>
        <form @submit.prevent="prevWeather">
          <label>
            <input
              type="text"
              v-model="city"
              name="city"
              placeholder="Paris"
              @click="((errorMessage = ''), (currentWeather = null))"
          /></label>
          <button>Rechercher</button>
        </form>
      </div>
    </div>

    <div class="bottom-div">
      <section class="section-map">
        <div id="map"></div>
      </section>

      <section class="section-weather">
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>

        <div v-else class="result">
          <div v-if="currentWeather">
            <div class="détails">
              <p>Ville demandée : {{ currentWeather.location.name }}</p>
              <p>Région : {{ currentWeather.location.région }}</p>
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
                Bon 2 signifie Modéré 3 signifie malsain pour le groupe sensible 4 signifie malsain
                5 signifie très malsain 6 signifie dangereux)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
<style scoped>
main {
  padding: 20px 50px;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

main > div:last-child {
  display: flex;
}

section {
  flex: 1;
  padding: 20px;
  border: 1px solid #000;
}

/* ----map------------ */
#map {
  width: 100%;
  height: 300px;
  border-radius: 10px;
}

/* -----response-------- */
.result {
  height: fit-content;
  border: 5px solid plum;
}

.result > div > div {
  border: 1px solid #000;
  height: 200px;
}
/* ---errorMessage */
.error-message {
  color: red;
  margin-top: 50px;
}
</style>
