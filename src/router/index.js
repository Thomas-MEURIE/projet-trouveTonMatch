import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'
import CreateView from '../views/CreateView.vue'
import JoinView from '../views/JoinView.vue'
import ProfileView from '../views/ProfileView.vue'
import CreateAccount from '../views/account/Create.vue'
import EditAccount from '../views/account/Edit.vue'
import CreateMatch from '../views/match/create.vue'
import MyMatchs from '../views/match/mesMatchs.vue'
//import MatchsPasses from '../views/match/passes.vue'
import MatchsInfos from '../views/match/info.vue'
//import EditMatch from '../views/match/edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Accueil', component: AccueilView },
    { path: '/create', name: 'Creer', component: CreateView },
    { path: '/join', name: 'Rejoindre', component: JoinView },
    { path: '/profile', name: 'Profil', component: ProfileView },
    { path: '/account/create', name: 'CreerCompte', component: CreateAccount },
    { path: '/account/edit', name: 'ModifierProfil', component: EditAccount },
    { path: '/match/create/:id', name: 'CreateMatch', component: CreateMatch },
    { path: '/match/mesmatchs/', name: 'MesMatchs', component: MyMatchs },
    //{ path: '/match/passes/', name: 'Passes', component: MatchsPasses },
    { path: '/match/info/:id', name: 'InfoMatch', component: MatchsInfos },
    // ici les autre routes
  ]
})

export default router
