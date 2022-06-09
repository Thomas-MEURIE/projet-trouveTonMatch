<template>
        <div class="flex flex-col items-center">
          <img class="my-[45px]" src="../assets/SmallLogo.png" alt="">
          <div class="w-11/12 border-2 bg-slate-100 flex flex-row p-2.5 rounded-full">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.7498 15.75L12.4873 12.4875" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input class="form-control bg-transparent ml-2.5" type="text" v-model="query" placeholder="Trouve un terrain" required />
          </div>
          <div v-for='stades in listeTerrains' :key='stades.id'>
              <div class="rounded-3xl flex max-w-[500px] flex-wrap border-2 mx-2 my-5 overflow-hidden border-gray-500">
                  <img class="object-cover w-full h-[145px]" :src="stades.image" :alt="stades.nom">
                  <div class="p-1.5 grid grid-cols-2 my-3 w-full content-center align-between">
                  <p>{{stades.nom}}</p>
                  <RouterLink class="btn btn-light justify-self-end mx-5 w-36 h-14 bg-green-400 rounded-full"  :to="{ name:'CreateMatch', params: { id: stades.id }}">
                      <p class="text-white text-center mt-[16px]">Organiser</p>
                  </RouterLink>
                  </div>
              </div>
          </div>
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
    onSnapshot } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js'

import { 
    getStorage, 
    ref, 
    getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js'

export default {  
  name:'ListeView',
  data() {
    return {
      listeTerrains:[],
      nom:null,
      listeTerrainsSynchro:[]
    }
  },
  mounted(){
    this.getTerrains();
    this.getTerrainsSynchro();
    
    let user = getAuth().currentUser;
    if(user){
        this.user = user;
        this.message = "User déjà connecté : "+this.user.email;
    }else{
        this.message = "";
              this.$router.push("/");
    }
  },
  methods:{
    async getTerrains(){
      
        const firestore = getFirestore();
        
        const dbTerrain= collection(firestore, "stades");
        
        const query = await getDocs(dbTerrain);
        query.forEach((doc) => {
            let stades = {
                id : doc.id,
                nom: doc.data().nom,
                codePostal: doc.data().codePostal,
                image: doc.data().image,
                ville: doc.data().ville
            }
            this.listeTerrains.push(stades);

            this.listeTerrains.forEach(async function(satde){

                    const storage = getStorage();
                    const spaceRef = ref(storage, 'stades/'+ satde.image);
                    getDownloadURL(spaceRef)
                    .then((url) => {
                        satde.image = url;
                    })
                    .catch((error) =>{
                        console.log('erreur downloadUrl', error);
                    })
                })
        })
    },

    async getTerrainsSynchro(){
      
      const firestore = getFirestore();
      
      const dbTerrains= collection(firestore, "stades");
      
      const query = await onSnapshot(dbTerrains, (snapshot) =>{
        
          this.listeTerrainsSynchro = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}));
      })

      this.listeTerrainsSynchro.forEach(async function(satde){

                    const storage = getStorage();
                    const spaceRef = ref(storage, 'stades/'+ satde.image);
                    getDownloadURL(spaceRef)
                    .then((url) => {
                        satde.image = url;
                    })
                    .catch((error) =>{
                        console.log('erreur downloadUrl', error);
                    })
                })
    },

    /*async createCategorie(){
      
      const firestore = getFirestore();
      
      const dbCategories= collection(firestore, "categories");
      
      const docRef = await addDoc(dbCategories,{
          libelle: this.libelle
      })
      console.log('document créé avec le id : ', docRef.id);
    },

    async updatecategories(categories){
      
      const firestore = getFirestore();
      
      const docRef = doc(firestore, "categories", categories.id);
      
      await updateDoc(docRef, {
          libelle: categories.libelle
      }) 
    },

    async deletecategories(categories){
      
      const firestore = getFirestore();
      
      const docRef = doc(firestore, "categories", categories.id);
      
      await deleteDoc(docRef);
    },*/
  },
  computed:{
      searchByName() {
          let query = this.query;
          return this.liste.filter(function(listeTerrainsSynchro){
              return listeTerrainsSynchro.nom.includes(query);
          })                
      },
  }
}
</script>



