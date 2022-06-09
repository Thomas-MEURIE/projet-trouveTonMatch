<template>
    <div class="fixed top-0 w-full rounded-b-2xl bg-blue-400">
      <p class="py-[10px] pl-[20px] text-xl text-white">Mes matchs</p>
    <nav class="w-full] grid grid-cols-2 justify-items-center items-center pb-[10px]">
       <RouterLink to="/match/mesmatchs" class="no-underline p-[10px] my-[5px] bg-gray-300 rounded-xl flex flex-col content-center justify-items-center">
        <p>Mes Match</p>
      </RouterLink>
      <RouterLink to="/match/attente" class="no-underline p-[10px] my-[5px] bg-green-400 text-white rounded-xl flex flex-col content-center justify-items-center">
        <p>En attente</p>
      </RouterLink>
      <RouterLink to="/match/passes" class="no-underline p-[10px] my-[5px] bg-gray-300 rounded-xl flex flex-col content-center justify-items-center">
        <p>Match passé</p>
      </RouterLink>
      <RouterLink to="/match/annules" class="no-underline p-[10px] my-[5px] bg-gray-300 rounded-xl flex flex-col content-center justify-items-center">
        <p>Match Annulés</p>
      </RouterLink>
    </nav>
    </div>
        <div class="flex flex-col items-center mt-[180px]">
          
          <tbody>
            <p v-if="listeMatchs.length == 0" class="mt-[80px]">Vous n'êtes dans aucune attente de match</p>

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
            const m = query(q, where("waiting", "array-contains", this.user.uid));
            const d = query(m, where("date", ">", dateStamp));
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

        async askMatch(id){
              // Obtenir Firestore
              const firestore = getFirestore();
              // Base de données (collection)  document participant
              // Récupération sur Firestore du participant via son id
              const docRef = doc(firestore, "matchs", id);
              // Référence du participant concerné
              const refMatch = await getDoc(docRef);
              // Test si le participant demandé existe
              const curMatch = refMatch.data();
              if (curMatch.participants.includes(this.user.uid))
                console.log('already in the match')
              else if(curMatch.waiting.includes(this.user.uid))
                console.log('already in waiting list')
              else{
                console.log('Joining list')
                curMatch.waiting.push(this.user.uid)
              }
                  // Mémorisation photoActuelle
                //this.userData.dateNaissance = Timestamp.fromDate(this.userData.dateNaissance);
                // Modification du participant à partir de son id
              await updateDoc(doc(firestore, "matchs", id), curMatch);       
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