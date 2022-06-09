<template>
            <div class="flex flex-col items-center">
                <img src="../../../public/logo.png" alt="" class="my-[50px] w-auto h-auto">
            </div>
            <form class="flex flex-col items-center mb-[96px]" @submit.prevent="createAc()">

                <img class="preview rounded-full img-fluid w-3/5 h-auto mb-[50px]" :src="imageData">
                <input class="form-control w-9/12" id="image" type="file" ref="file" @change="previewImage" />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <input class="form-control w-9/12" id="username" type="text" v-model="userData.userName" placeholder="Nom d'utilisateur" required />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <input class="form-control w-9/12" id="email" type="text" v-model="user.email" placeholder="E-mail" required />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <input class="form-control w-9/12" id="password" type="password" v-model="user.password" placeholder="Mot de passe" required />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <input class="form-control w-9/12" id="dateNaissance" type="date" v-model="userData.dateNaissance" placeholder="Date de naissance" required />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <input class="form-control w-9/12" id="Ville" type="text" v-model="userData.ville" placeholder="Ville" required />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <div class="flex flex-row flex-wrap justify-between w-9/12">
                <label for="niveau">Niveau</label>
                <select class="shrink" name="niveau" id="niveau" v-model="userData.niveau">
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiare">Intermédiare</option>
                    <option value="Expert">Expert</option>
                </select>
                </div>

                <div class="h-[32px] mt-[20px] alert alert-warning text-center mb-3" v-if="message!=null" >
                    {{ message }}
                </div>
                
                <button class="h-[52px] w-11/12 bg-green-400 mt-[40px] rounded-full text-white" type="submit">
                    Créer un compte
                </button>
                
                <button class="float-right h-[52px] w-11/12 bg-blue-800 mt-[20px] rounded-full text-white" type="submit">
                    Se connecter avec Facebook
                </button>
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
    addDoc,         // Ajouter un document à une collection
    updateDoc,      // Mettre à jour un document dans une collection
    deleteDoc,      // Supprimer un document d'une collection
    onSnapshot,     // Demander une liste de documents d'une collection, en les synchronisant
    query,          // Permet d'effectuer des requêtes sur Firestore
    orderBy,
    Timestamp         // Permet de demander le tri d'une requête query
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
                userData:{
                    userName:null,
                    dateNaissance:null,
                    avatar:'profileDefault.png',
                    niveau:null,
                    uid:null,
                    ville:null,
                    notif:true,
                },
                imgModifiee:false,
                message:null,
            }
        },

        mounted(){  
            this.getImage();
        },

        methods:{

            createAc(){
                createUserWithEmailAndPassword(getAuth(), this.user.email, this.user.password)
                .then((response) => {
                    // Signed in
                    this.onCnx();
                    // ...
                })
                .catch((error) => {
                    // ..
                })
            },
            onCnx(){     
                signInWithEmailAndPassword(getAuth(), this.user.email, this.user.password)
                .then((response)=>{
                    console.log('user connecté', response.user);
                    this.userData.uid = response.user.uid;
                    this.message = "Email connecté : "+ this.user.email;
                    this.createPro();
                })
                .catch((error) =>{
                    console.log('Erreur connexion', error);
                    this.message = "Erreur d'authentification, veuillez vérifier l'e-mail et le mot de passe";
                })
            },

            previewImage: function(event) {
                // Mise à jour de la photo du participant
                this.file = this.$refs.file.files[0];
                // Récupérer le nom du fichier pour la photo du participant
                this.userData.avatar = this.file.name;
                // Reference to the DOM input element
                // Reference du fichier à prévisualiser
                var input = event.target;
                // On s'assure que l'on a au moins un fichier à lire
                if (input.files && input.files[0]) {
                    // Creation d'un filereader
                    // Pour lire l'image et la convertir en base 64
                    var reader = new FileReader();
                    // fonction callback appellée lors que le fichier a été chargé
                    reader.onload = (e) => {
                        // Read image as base64 and set to imageData
                        // lecture du fichier pour mettre à jour 
                        // la prévisualisation
                        this.imageData = e.target.result;
                    }
                    // Demarrage du reader pour la transformer en data URL (format base 64) 
                    reader.readAsDataURL(input.files[0]);        
                }
            },

            async getImage(){
                const storage = getStorage();
                const spaceRef = ref(storage, 'user/profileDefault.png');
                this.photoActuelle = 'profileDefault.png';

                getDownloadURL(spaceRef)
                    .then((url) => {
                        this.imageData = url;
                })
                .catch((error) =>{
                    console.log('erreur downloadUrl', error);
                })
            },
            
            async createPro(){
                //this.userData.dateNaissance = Timestamp.fromDate(this.userData.dateNaissance);
                updateProfile(getAuth().currentUser, {
                displayName: this.userData.userName
                }).then((response) => {
                    this.message = "User connecté : "+ this.userData.userName;
                }).catch((error) => {
                // An error occurred
                // ...
                });
                // Obtenir storage Firebase
                const storage = getStorage();
                // Référence de l'image à uploader
                if (this.userData.avatar != 'profileDefault.png') {
                    const refStorage = ref(storage, 'user/'+this.userData.avatar);
                    // Upload de l'image sur le Cloud Storage
                    await uploadString(refStorage, this.imageData, 'data_url').then((snapshot) => {
                        console.log('Uploaded a base64 string');
                    });
                }
                // Création du participant sur le Firestore
                const db = getFirestore();
                const docRef = addDoc(collection(db, 'compte'), this.userData );
                // redirection sur la liste des participants
                this.$router.push('/join');            
        }
        }
    }
</script>