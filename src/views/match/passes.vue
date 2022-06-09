<template>
    <nav class="fixed top-0 w-full h-[96px] flex flex-row justify-evenly items-center rounded-b-2xl bg-gray-300">
      <RouterLink to="/match/mesmatchs" class="no-underline flex flex-col content-center justify-items-center">
        <p>Mes Match</p>
      </RouterLink>
      <RouterLink to="match/attente" class="no-underline flex flex-col content-center justify-items-center">
        <p>En attente</p>
      </RouterLink>
      <RouterLink to="/match/passes" class="no-underline flex flex-col content-center justify-items-center">
        <p>Match passé</p>
      </RouterLink>
      <RouterLink to="/match/annules" class="no-underline flex flex-col content-center justify-items-center">
        <p>Match Annulés</p>
      </RouterLink>
    </nav>
        <div class="flex flex-col items-center mt-[100px]">
          
          <tbody>
            <p v-if="listeMatchs.length == 0">Vous n'avez participé à aucun match</p>
          <tr v-for='matchs in listeMatchs' :key='matchs.id'>

          <div class="rounded-[10px] flex flex-wrap flex-row border-2 border-gray-500 mx-2 my-5 overflow-hidden">
              <p class="px-[10px] py-[4px] mt-[13px] ml-[13px] text-green-400 font-bold">{{matchs.stade}}</p>
                <div class="h-px w-full bg-black my-[10px]"></div>
                <div class="p-1.5 flex flex-col my-0.5 w-full items-center">
                <div class="p-1.5 grid grid-cols-2 my-3 w-full content-center align-between text-center">
                  <div>
                    <p>{{dateFr(matchs.date)}}</p>
                    <p class="text-slate-500">{{hourFr(matchs.date)}}</p>
                  </div>
                  <div>
                    <p>Niveau du Match</p>
                    <p class="text-slate-500">{{matchs.niveau}}</p>
                  </div>
                </div>
                <div class="my-[-10px] text-center">
                  <p>Places</p>
                  <div class="font-bold flex flex-row flex-wrap text-lg text-center justify-center items-end align-bottom">
                    <p class="text-blue-400 text-xl">{{matchs.participants.length}}</p>
                    <p class="before:content-['/']">{{matchs.placesMax}}</p>
                  </div>
                </div>
                <div class="p-1.5 flex flex-col my-0.5 w-full items-center">
                  <div class="p-1.5 grid grid-cols-2 my-3 w-full content-center align-between text-center">
                    <div>
                      <p>Type de Sport</p>
                      <p class="text-slate-500">{{matchs.sport}}</p>
                    </div>
                    <div>
                      <p>Type de Match</p>
                      <p class="text-slate-500">{{matchs.type}}</p>
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <div class="flex flex-row flex-wrap btn btn-light mx-5 mb-[15px] h-14 bg-green-400 rounded-full justify-center items-center" v-if="true">
                      <p class="text-white">Tchat</p>
                  </div>
                  <div class="flex flex-row flex-wrap btn btn-light mx-5 h-14 bg-blue-400 rounded-full justify-center items-center">
                      <p class="text-white">Voir le match</p>
                  </div>
                </div>
              </div>
          </div>
          </tr>
          </tbody>
        </div>
</template>
          
<script>
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'


import { 
    getFirestore, 
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query,
    getDoc,
    where,
    onSnapshot,
    Timestamp } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js'
    
import { 
    getStorage, 
    ref, 
    getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js'

export default {  
  name:'ListeView',
  data() {
    return {
      listeMatchs:[],
      user:null,
    }
  },
  mounted(){
    this.getMatchs();
    
    let user = getAuth().currentUser;
    if(user){
        this.user = user;
        this.message = "User déjà connecté : "+this.user.email;
    }else{
        this.message = "";
              this.$router.push("/");
    }
    this.getMatchs();
  },
  methods:{
    async getMatchs(){
            var today = new Date();
            var dateStamp = Timestamp.fromDate(today);

            // Obtenir Firestore
            const firestore = getFirestore();
            // Base de données (collection)  document participant
            const dbMatchs = collection(firestore, "matchs");
            // Liste des participants triés sur leur nom
            const q = query(dbMatchs, where("annule", "==", false));
            // Liste des participants triés sur leur nom
            const m = query(q, where("participants", "array-contains", this.user.uid));
            const d = query(m, where("date", "<=", dateStamp));
            await onSnapshot(d, (snapshot) => {
                this.listeMatchs = snapshot.docs.map(doc => (
                    {id:doc.id, ...doc.data()}
                ))
              this.listeMatchs.forEach(async function(match){
                    
                    const docRef = doc(firestore, "stades", match.localisation);
                    const stadeDoc = await getDoc(docRef);
                    const stadeData = stadeDoc.data();

                    match.stade = stadeData.nom;
                })
            })      
        },

    dateFr(d){
        let date = d.toDate();
        //let date = d;
        return date.toLocaleDateString("fr-fr", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      },

    hourFr(d){
        let date = d.toDate();
        //let date = d;
        return date.getHours() + 'h' + date.getMinutes();
    }
  }
}
</script>