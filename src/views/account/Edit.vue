<template>
            <div class="flex flex-col items-center">
                <img src="../../../public/logo.png" alt="" class="my-[50px] w-auto h-auto">
            </div>
            <form class="flex flex-col items-center mb-[96px]" @submit.prevent="updatePro()">

                <img class="preview rounded-full img-fluid w-3/5 h-auto mb-[50px]" :src="imageData">
                <input class="form-control w-9/12" id="image" type="file" ref="file" @change="previewImage" />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <input class="form-control w-9/12" id="username" type="text" v-model="userData.userName" placeholder="Nom d'utilisateur" required />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <input class="form-control w-9/12" id="email" type="text" v-model="user.email" placeholder="E-mail" required />
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
                    Enregistrer
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
                userData:{
                    userName:null,
                    dateNaissance:null,
                    avatar:null,
                    niveau:null,
                    uid:null,
                    ville:null,
                    notif:true,
                },
                imgModifiee:false,
                message:null,
                fileID:null,
            }
        },

        mounted(){  
          let user = getAuth().currentUser;
          if(user){
                this.getUserInfo(user);
                this.user = user;
                this.userData.uid = user.uid;
                console.log('user: ' + this.user);
              //this.message = "User déjà connecté : "+this.user.email;
          }else{
              this.message = "";
              this.$router.push("/");
          }
        },

        methods:{
            async getUserInfo(user){
                console.log('id is: ' + user.uid);
                const fireStore = getFirestore();
                const dbUser = collection(fireStore, "compte")
                const q = query(dbUser, where("uid", "==", user.uid));
                await onSnapshot(q, (snapshot) => {
                this.userInfo = snapshot.docs.map(doc => (
                    {id:doc.id, ...doc.data()}
                ));
                console.log("userInfo", this.userInfo)
                
                this.fileID = this.userInfo[0].id;
                this.userData.userName = this.userInfo[0].userName;
                this.userData.avatar = this.userInfo[0].avatar;
                this.userData.ville = this.userInfo[0].ville;
                this.userData.niveau = this.userInfo[0].niveau;
                this.userData.dateNaissance = this.userInfo[0].dateNaissance;

                const spaceRef = ref(getStorage(), 'user/'+this.userData.avatar);
                getDownloadURL(spaceRef)
                    .then((url) => {
                    this.imageData = url;
                    })
                    .catch((error) =>{
                    console.log('erreur downloadURL', error)
                    })
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

            async updatePro(){
                //this.userData.dateNaissance = Timestamp.fromDate(this.userData.dateNaissance);
                updateProfile(getAuth().currentUser, {
                email: this.user.email
                }).then((response) => {
                    this.message = "User MAJ : "+ this.user.displayName;
                }).catch((error) => {
                // An error occurred
                // ...
                });
                // Si l'image a été modifiée
                if(this.imgModifiee){
                    // On supprime l'ancienne
                    const storage = getStorage();
                    // Référence du fichier
                    let docRef = ref(storage, 'user/'+this.photoActuelle);
                    // Suppression photo actuelle
                    if (this.photoActuelle != 'profileDefault.png')
                        deleteObject(docRef);
                    // création nouvelle photo
                    // Référence de l'image à uploader
                    docRef = ref(storage, 'user/'+this.userData.avatar);
                    await uploadString(docRef, this.imageData, 'data_url').then((snapshot) => {
                        console.log('Uploaded a base64 string', this.userData.avatar);                
                    });                   
                }
                // Dans tous les cas on met à jour le participant dans Firestore
                const firestore = getFirestore();
                // Modification du participant à partir de son id
                await updateDoc(doc(firestore, "compte", this.fileID), this.userData);
                // redirection sur la liste des participants
                this.$router.push('/profile');         
        }
        }
    }
</script>