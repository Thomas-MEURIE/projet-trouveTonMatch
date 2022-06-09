import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'
import CreateView from '../views/CreateView.vue'
import JoinView from '../views/JoinView.vue'
import ProfileView from '../views/ProfileView.vue'
import CreateAccount from '../views/account/Create.vue'
import EditAccount from '../views/account/Edit.vue'
import CreateMatch from '../views/match/create.vue'
//import EditMatch from '../views/match/edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Accueil', component: AccueilView },
    { path: '/create', name: 'Creer', component: CreateView },
    { path: '/join', name: 'Rejoindre', component: JoinView },
    { path: '/profile', name: 'Profil', component: ProfileView },
    { path: '/account/create', name: 'Creer compte', component: CreateAccount },
    { path: '/account/edit', name: 'Modifier profil', component: EditAccount },
    { path: '/match/create/:id', name: 'CreateMatch', component: CreateMatch },
    //{ path: '/match/edit/:id', name: 'EditMatch', component: EditMatch },
    // ici les autre routes
  ]
})

export default router
