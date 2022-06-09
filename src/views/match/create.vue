<template>
            <form class="w-full h-screen flex flex-col items-center pt-[70px] bg-green-400 mb-[-20px] text-white" @submit.prevent="createMatch()">
                <div class="md:w-[70%] h-full flex flex-col items-center text-white">
                    <div class="mb-[70px]">
                        <p>Créer un match</p>
                        <p>{{nom}}</p>
                    </div>

                    <div class="flex flex-row flex-wrap justify-between w-9/12">
                        <label for="niveau">Sport</label>
                        <select class="shrink text-black" name="sport" id="sport" v-model="match.sport">
                            <option value="Football">Football</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Volleyball">Volleyball</option>
                            <option value="Pétanque">Pétanque</option>
                        </select>
                    </div>
                    <div class="h-px w-9/12 bg-white my-[30px]"></div>
                    <div class="flex flex-row flex-wrap justify-between w-9/12">
                        <label for="niveau">Type</label>
                        <select class="shrink text-black" name="type" id="type" v-model="match.type">
                            <option value="3v3">3v3</option>
                            <option value="4v4">4v4</option>
                            <option value="5v5">5v5</option>
                            <option value="6v6">6v6</option>
                        </select>
                    </div>
                    <div class="h-px w-9/12 bg-white my-[30px]"></div>
                    <div class="flex flex-row flex-wrap justify-between w-9/12">
                        <label for="niveau">Niveau</label>
                        <select class="shrink text-black" name="niveau" id="niveau" v-model="match.niveau">
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiare">Intermédiare</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    <div class="h-px w-9/12 bg-white my-[30px]"></div>
                    <label class="justify-self-start" for="dateMatch">Date et heure</label>
                    <input class="form-control w-9/12 text-black" id="dateMatch" type="datetime-local" v-model="match.date" placeholder="Date et Heure" required />
                    
                    <div class="w-[80%] mt-[30px]">
                        <p>*Nous ne permettons en aucuns cas la réservation d’un terrain libre d’accès.</p>
                    </div>

                    <button class="h-[52px] w-11/12 bg-blue-400 mt-[40px] rounded-full text-white" type="submit">
                        Enregistrer
                    </button>
                </div>
            </form>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'

// Bibliothèque Firestore : import des fonctions
import { 
    getFirestore,   // Obtenir le Firestore
    collection,     // Utiliser une collection de documents
    doc,            // Obtenir un document par son id
    getDocs,       // Obtenir la liste des documents d'une collection
    getDoc,       // Obtenir la liste des documents d'une collection
    addDoc,         // Ajouter un document à une collection
    updateDoc,      // Mettre à jour un document dans une collection
    deleteDoc,      // Supprimer un document d'une collection
    onSnapshot,     // Demander une liste de documents d'une collection, en les synchronisant
    query,          // Permet d'effectuer des requêtes sur Firestore
    orderBy,
    Timestamp      // Permet de demander le tri d'une requête query
    } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js'


    // Cloud Storage : import des fonctions
    import { 
        getStorage,             // Obtenir le Cloud Storage
        ref,                    // Pour créer une référence à un fichier à uploader
        getDownloadURL,         // Permet de récupérer l'adress complète d'un fichier du Storage
        uploadString,           // Permet d'uploader sur le Cloud Storage une image en Base64
    } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js'

 
export default {
    name:'CreateView',
    data() {
        return {                
            user:{
                email:null,
                password:null,
                uid:null
            },
            nom:null,
            match:{
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
            }
        }
    },
    mounted(){
          let user = getAuth().currentUser;
          if(user){
              this.user = user;
              console.log('user: ' + this.user.email);
              this.message = "User déjà connecté : "+this.user.email;
          }else{
              this.message = "";
              this.$router.push("/");
          }
            this.getTerrain(this.$route.params.id);
    },
    methods : {

        async getTerrain(id){
            this.match.localisation = this.$route.params.id;
            const firestore = getFirestore();
            const docRef = doc(firestore, "stades", id);
            this.refterrain = await getDoc(docRef);
            if(this.refTerrain.exists()){
                this.terrain = this.refTerrain.data();
                this.nom = this.terrain.nom;
            }else{
                this.console.log("Terrain inexistant");
            }
        },

        async createMatch(){
            if (this.match.type == '3v3')
                    this.match.placesMax = 6;
            if (this.match.type == '4v4')
                    this.match.placesMax = 8;
            if (this.match.type == '5v5')
                    this.match.placesMax = 10;
            if (this.match.type == '6v6 ')
                    this.match.placesMax = 12;

            var dayTime = new Date(this.match.date+':00.000');
            var dateStamp = Timestamp.fromDate(dayTime);
            this.match.date = dateStamp;
            console.log('Date: '+ dateStamp.toDate().toLocaleDateString("fr-fr", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

            const firestore = getFirestore();
            const dbMatch= collection(firestore, "matchs");   
            const docRef = await addDoc(dbMatch,{
                annule: this.match.annule,
                creator: this.user.uid,
                date: this.match.date,
                localisation: this.match.localisation,
                niveau: this.match.niveau,
                participants:[this.user.uid],
                placesMax: this.match.placesMax,
                sport: this.match.sport,
                type: this.match.type,
                waiting:[]
            })
            
            this.$router.push('/join');
        },
    }

}
</script>

<style scoped>
a{
    color:white;
}
a:hover{
    text-decoration:none;
}
</style>


