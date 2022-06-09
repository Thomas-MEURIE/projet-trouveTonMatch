<template>
    <div class="fixed top-0 w-full rounded-b-2xl bg-blue-400">
      <p class="py-[10px] pl-[20px] text-xl text-white">Mes matchs</p>
    <nav class="w-full] grid grid-cols-2 justify-items-center items-center pb-[10px]">
       <RouterLink to="/match/mesmatchs" class="no-underline p-[10px] my-[5px] bg-gray-300 rounded-xl flex flex-col content-center justify-items-center">
        <p>Mes Match</p>
      </RouterLink>
      <RouterLink to="/match/attente" class="no-underline p-[10px] my-[5px] bg-gray-300 rounded-xl flex flex-col content-center justify-items-center">
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
            <form class="flex flex-col items-center mt-[180px] mb-[96px]">

            
            <div class="flex flex-col items-center mb-[10px] px-[40px]">
                    <a :href="urlTerrain" class="w-full rounded-full py-[10px] px-[15px] my-[20px] bg-blue-400 text-center text-white">
                        <p>Aller vers {{nomTerrain}}</p>
                    </a>
                    <button class="w-full rounded-full py-[10px] px-[15px] bg-red-400 text-white" v-if="modifiable" type="button" @click="annuler()">
                        <p v-if="isCreator">Annuler le match</p>
                        <p v-if="!isCreator">Quitter le match</p>
                    </button>
            </div>

            <p class="self-start pl-[10px] py-[10px]">Dans le match :</p>

            <div class="w-[80%] bg-gray-300 h-[50px] my-[5px] px-[20px]" v-for="part in listeParticipants" :key='part.userName'>
                <div class="h-full flex flex-row items-center">
                    <img class="rounded-full h-[80%] w-auto" :src="getImage(part.avatar)">
                    <p>{{part.userName}}</p>
                </div>
            </div>

            <p class="self-start pl-[10px] py-[10px]">En attente :</p>
            <p class="self-start px-[20px] py-[10px]" v-if="listeAttente.length == 0">Il n'y a personne en attente</p>

            <div class="flex flex-row flex-wrap justify-between w-[80%] bg-gray-300 h-[50px] my-[5px] px-[20px]" v-for="(part, index) in listeAttente" :key='part.userName'>
                <div class="h-full flex flex-row items-center">
                    <img class="rounded-full h-[80%] w-auto" :src="getImage(part.avatar)">
                    <p>{{part.userName}}</p>
                </div>
                <div class="h-full flex flex-row items-center">
                    <button class="rounded-full p-[5px] bg-green-400 text-white mr-[10px]" v-if="isCreator && modifiable" type="button" @click="accept(index)">
                        <p>Accepter</p>
                    </button>
                    <button class="rounded-full p-[5px] bg-red-400 text-white" v-if="isCreator && modifiable" type="button" @click="decline(index)">
                        <p>Refuser</p>
                    </button>
                </div>
            </div>


            </form>
            <hr class='mb-5' style='clear:both'/>
</template>
          
<script>
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'


import { 
    getFirestore,   // Obtenir le Firestore
    collection,     // Utiliser une collection de documents
    doc,            // Obtenir un document par son id
    getDocs,        // Obtenir la liste des documents d'une collection
    getDoc,        // Obtenir la liste des documents d'une collection
    addDoc,         // Ajouter un document à une collection
    updateDoc,      // Mettre à jour un document dans une collection
    deleteDoc,      // Supprimer un document d'une collection
    onSnapshot,     // Demander une liste de documents d'une collection, en les synchronisant
    query,          // Permet d'effectuer des requêtes sur Firestore
    orderBy,
    where,
    Timestamp       // Permet de demander le tri d'une requête query
    } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js'

import {
    getStorage,
    ref, 
    getDownloadURL, 
    uploadBytes,
    uploadString,
    deleteObject,
    listAll
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js'

    export default {   
        data(){
            return{   
                imageData:null,             
                user:{
                    email:null,
                    password:null,
                    displayName:null,
                    uid:null,
                },
                martchData:{
                    annule:false,
                    creator:null,
                    date:null,
                    localisation:null,
                    niveau:null,
                    participants:[],
                    placesMax:null,
                    sport:null,
                    type:null,
                    waiting:[]
                },
                listeParticipants:[],
                listeAttente:[],
                nomTerrain: '',
                urlTerrain: '#',
                message:null,
                refmatch:null,
                refterrain:null,
                isCreator:false,
                modifiable:true,
            }
        },

        mounted(){  
          let user = getAuth().currentUser;
          if(user){
                this.user = user;
                console.log('user: ' + this.user.uid);
                this.getMatch();
              //this.message = "User déjà connecté : "+this.user.email;
          }else{
              this.message = "";
              this.$router.push("/");
          }
        },

        methods:{

            async getMatch(){
                const firestore = getFirestore();
                const docRef = doc(firestore, "matchs", this.$route.params.id);
                this.refmatch = await getDoc(docRef);
                if(this.refmatch.exists()){
                    this.match = this.refmatch.data();
                    console.log("match : " + this.match);

                    if (this.match.creator == this.user.uid)
                    this.isCreator = true;
                    console.log("créateur : " + this.isCreator);

                    const satdeID = this.match.localisation;

                    const date = new Date();

                    if ((Timestamp.fromDate(date) > this.match.date) || this.match.annule)
                        this.modifiable = false;
                    
                    const docRefTerrain = doc(firestore, "stades", satdeID);
                    this.refTerrain = await getDoc(docRefTerrain);
                    if(this.refTerrain.exists()){
                        this.terrain = this.refTerrain.data();
                        this.nomTerrain = this.terrain.nom;
                        this.urlTerrain = this.terrain.map;
                        console.log("stade : " + satdeID);
                    }
                    else{
                        console.log("Terrain inexistant");
                    }

                    for (let i in this.match.participants) {
                        console.log("Participant : " + this.match.participants[i]);
                        const dbUser = collection(firestore, "compte")
                        const q = query(dbUser, where("uid", "==", this.match.participants[i]));
                        await onSnapshot(q, (snapshot) => {
                            this.userInfo = snapshot.docs.map(doc => (
                                {id:doc.id, ...doc.data()}
                            ))
                            var listeParticipantsBase;
                            this.userInfo.forEach(function(user){
                                listeParticipantsBase = user;
                            })
                            ;
                            this.listeParticipants.push(listeParticipantsBase);
                        });
                    }

                    for (let i in this.match.waiting) {
                        console.log("Participant : " + this.match.waiting[i]);
                        const dbUser = collection(firestore, "compte")
                        const q = query(dbUser, where("uid", "==", this.match.waiting[i]));
                        await onSnapshot(q, (snapshot) => {
                            this.userInfo = snapshot.docs.map(doc => (
                                {id:doc.id, ...doc.data()}
                            ))
                            var listeParticipantsBase;
                            this.userInfo.forEach(function(user){
                                listeParticipantsBase = user;
                            })
                            ;
                            this.listeAttente.push(listeParticipantsBase);
                        });
                    }
                }
            },

            getImage(image){
                var result = '';
                const storage = getStorage();
                // Récupération de l'image par son nom de fichier
                const spaceRef = ref(storage, 'user/'+ image);
                // Récupération de l'url complète de l'image
                getDownloadURL(spaceRef)
                .then((url) => {
                    // On remplace le nom du fichier
                    // Par l'url complète de la photo
                    console.log("URL image : " + url);
                    result = url;
                    return result;
                })
                .catch((error) =>{
                    console.log('erreur downloadUrl', error);
                })
            },

            async annuler(){
                    const firestore = getFirestore();
                if(this.isCreator){
                    this.match.annule = true;
                }
                else{
                    const listLenght = this.match.participants.length;
                    console.log('nouvelle liste : ', listLenght);
                    for (let i = 0; i < listLenght; i++) {
                        if (this.match.participants[i] == this.user.uid) {
                            this.match.participants.splice(i, 1);
                            console.log('nouvelle liste : ', this.match.participants);
                        }
                    }
                }
                await updateDoc(doc(firestore, "matchs", this.$route.params.id), this.match);
                this.$router.push('/match/mesmatchs');
            },

            async decline(part){
                this.match.waiting.splice(part, 1);
                console.log('Num dans liste retiré : ', part);
                const firestore = getFirestore();
                // Modification du participant à partir de son id
                await updateDoc(doc(firestore, "matchs", this.$route.params.id), this.match);
                this.listeParticipants = [];
                this.listeAttente = [];
                this.getMatch();
            },

            async accept(part){
                this.match.participants.push(this.match.waiting[part])
                this.match.waiting.splice(part, 1);
                const firestore = getFirestore();
                // Modification du participant à partir de son id
                await updateDoc(doc(firestore, "matchs", this.$route.params.id), this.match);
                this.listeParticipants = [];
                this.listeAttente = [];
                this.getMatch();
            }
        }
    }
</script>