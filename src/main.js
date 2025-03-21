import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faLocationArrow,
  faMapMarkerAlt,
  faStar,
  faSun,
  faThermometerHalf,
  faThermometerQuarter,
  faThermometerThreeQuarters,
  faTint,
  faWind,
} from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'

library.add(
  faMapMarkerAlt,
  faCalendar,
  faThermometerHalf,
  faThermometerThreeQuarters,
  faThermometerQuarter,
  faTint,
  faWind,
  faLocationArrow,
  faSun,
  faStar,
)

const app = createApp(App)

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
