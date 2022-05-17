import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { createRouter, createWebHistory } from 'vue-router'
import routesFromPages from '~pages'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // possible d'ajouter ses propres routes
        // en plus de celles faites automatiquement
        ...routesFromPages,
    ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')