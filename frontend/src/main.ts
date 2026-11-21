import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import { hydrateAuth } from './services/authStore'

const app = createApp(App)
// Pulihkan sesi login dulu, baru pasang router (agar guard tidak salah redirect saat refresh)
hydrateAuth().finally(() => {
  app.use(router)
  app.mount('#app')
})
