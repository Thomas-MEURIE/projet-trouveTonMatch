import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import mitt from 'mitt';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBB1ozkHav4cVWczF8Nx_44nZdcrxHpgts",
    authDomain: "projet-trouvetonmatch.firebaseapp.com",
    projectId: "projet-trouvetonmatch",
    storageBucket: "projet-trouvetonmatch.appspot.com",
    messagingSenderId: "1034254853027",
    appId: "1:1034254853027:web:5dd8e6e52591c76193f016"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

const app = createApp(App)

export const emitter = mitt();

app.config.globalProperties.emitter = emitter;

app.use(router)

app.mount('#app')
