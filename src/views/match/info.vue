<template>
            <form class="flex flex-col items-center mb-[96px]" @submit.prevent="updateMatch()">

            <a href="#">Aller vers {{nomTerrain}}</a>

                <div class="h-[32px] mt-[20px] alert alert-warning text-center mb-3" v-if="message!=null" >
                    {{ message }}
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
    where       // Permet de demander le tri d'une requête query
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
            }
        },

        mounted(){  
          let user = getAuth().currentUser;
          if(user){
                this.user = user;
                console.log('user: ' + this.user);
              //this.message = "User déjà connecté : "+this.user.email;
          }else{
              this.message = "";
              this.$router.push("/");
          }
          this.getMatch(this.$route.params.id);
        },

        methods:{

            async getMatch(id){
                const firestore = getFirestore();
                const docRef =  (firestore, "matchs", id);
                this.refmatch = await getDoc(docRef);
                if(this.refmatch.exists()){
                    this.match = this.refmatch.data();
                    this.console.log("match : " + this.match);
                    /*
                    const docRefTerrain =  (firestore, "stades", this.match.localisation);
                    this.refterrain = await getDoc(docRefTerrain);
                    if(this.refTerrain.exists()){
                        this.terrain = this.refTerrain.data();
                        this.nomTerrain = this.terrain.nom;
                        this.urlTerrain = this.terrain.map;
                    }
                    else{
                        this.console.log("Terrain inexistant");
                    }

                    var partLenght = this.match.participants.lenght;
                    for (let i = 0; i < partLenght; i++) {
                        const dbUser = collection(firestore, "compte")
                        const q = query(dbUser, where("uid", "==", this.match.participants[i]));
                        await onSnapshot(q, (snapshot) => {
                        this.userInfo = snapshot.docs.map(doc => (
                            {id:doc.id, ...doc.data()}
                        ));
                        console.log("userInfo", this.userInfo)
                        
                        var userData = this.userInfo[0];

                        const spaceRef = ref(getStorage(), 'user/'+ userData.avatar);
                        getDownloadURL(spaceRef)
                            .then((url) => {
                            userData.avatar = url;
                            })
                            .catch((error) =>{
                            console.log('erreur downloadURL', error)
                            })
                        })
                        this.listeParticipants.push(userData);
                    }

                    var waitingLenght = this.match.waiting.lenght;
                    for (let i = 0; i < waitingLenght; i++) {
                        const dbUser = collection(firestore, "compte")
                        const q = query(dbUser, where("uid", "==", i));
                        await onSnapshot(q, (snapshot) => {
                        this.userInfo = snapshot.docs.map(doc => (
                            {id:doc.id, ...doc.data()}
                        ));
                        console.log("userInfo", this.userInfo)
                        
                        var userData = this.userInfo[0];

                        const spaceRef = ref(getStorage(), 'user/'+ userData.avatar);
                        getDownloadURL(spaceRef)
                            .then((url) => {
                            userData.avatar = url;
                            })
                            .catch((error) =>{
                            console.log('erreur downloadURL', error)
                            })
                        })
                        this.listeParticipants.push(userData);
                    }*/
                }else{
                    this.console.log("Match inexistant");
                }
            },

            async updatePro(){         
            }
        }
    }
</script>