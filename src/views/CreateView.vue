<template>
        <div v-for='stades in listeTerrainsSynchro' :key='stades.id'>
            <div class="rounded-3xl flex flex-wrap border-2 mx-2 my-5">
                <img class="rounded-t-3xl" :src="stades.image" :alt="stades.nom">
                <div class="p-1.5 grid grid-cols-2 my-3 w-full content-center align-between">
                <p>{{stades.nom}}</p>
                <button class="btn btn-light justify-self-end mx-5 w-36 h-14 bg-green-400 rounded-full" type="button" title="Création">
                    <p class="text-color-white">Organiser</p>
                </button>
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
        })
    },

    async getTerrainsSynchro(){
      
      const firestore = getFirestore();
      
      const dbTerrains= collection(firestore, "stades");
      
      const query = await onSnapshot(dbTerrains, (snapshot) =>{
        
          this.listeTerrainsSynchro = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}));
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
  }
}
</script>



