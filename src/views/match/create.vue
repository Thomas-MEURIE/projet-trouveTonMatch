<template>
    <div class="container">
        <form enctype="multipart/form-data" 
            @submit.prevent="createMatch"
        >
            <div class="card bg-dark">

                <div class="card-header">
                    <h5 style="color:white;">Création participant</h5>
                </div>    

                <div class="card-body">   
                    <div class="row">
                        <div class="col-6">
                            <div>
                                <img class="preview img-fluid" :src="imageData"/>
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" >Nom</span>
                                </div>
                                <input 
                                    class="form-control" placeholder="Nom de la personne"
                                    v-model="participant.nom"
                                    required />                    
                            </div>
                            <br/>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" >Prénom</span>
                                </div>
                                <input 
                                    v-model="participant.prenom"
                                    class="form-control" placeholder="Prénom de la personne" key=
                                    required />                    
                            </div>
                            <br/>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Photo</span>
                                </div>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" ref="file" id="file" 
                                    @change="previewImage"
                                    >
                                    <label class="custom-file-label" for="file">Sélectionner l'image</label>
                                </div>
                            </div>
                            <br/>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" >Date naissance</span>
                                </div>
                                <input 
                                    type="date"
                                    class="form-control"
                                    v-model="participant.naissance" 
                                    format="dd/mm/yyyy" 
                                    required />                    
                            </div>
                            <br/>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" >Pays</span>
                                </div>
                                <select class="custom-select" v-model="participant.nationalite">
                                    <option selected disabled>Sélectionner un Pays</option>
                                    <option v-for="pays in listePays" :key="pays.nom">
                                        {{pays.nom}}
                                    </option>
                                </select>
                            </div>
                            <br/>
                        </div>
                    </div>               
                </div>

                <div class="card-footer">   
                    <button type="submit" class="float-left btn btn-dark">
                        Créer
                    </button>
                    <button class="float-right btn btn-dark" >
                        <router-link to="/participants" >Cancel</router-link>
                    </button>
                </div>

            </div>
        </form>        
    </div>
</template>

<script>
// Bibliothèque Firestore : import des fonctions
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
    orderBy         // Permet de demander le tri d'une requête query
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
            imageData:null,         // Image prévisualisée
            match:{           // Le participant à créer
                annule:false,               // son nom
                image:null,            // son prénom
                photo:null,             // sa photo (nom du fichier)
                naissance:null,         // sa date de naissance
                nationalite:null        // sa nationalité
            }
        }
    },
    mounted(){ // Montage de la vue
        // Appel de la liste des pays
        this.getImage();
        this.getTerrain(this.$route.params.id);
    },
    methods : {

        async getImage(id){
            // Obtenir le Storage
            const storage = getStorage();
            // Référence de l'image du participant
            const spaceRef = ref(storage, 'user/profileDefault.png');
            // Récupération de l'url complète de l'image
            getDownloadURL(spaceRef)
                .then((url) => {
                    // Mise à jour de l'image prévisualisée
                    this.imageData = url;
            })
            .catch((error) =>{
                console.log('erreur downloadUrl', error);
            })
        },

        async getTerrain(id){
            // Obtenir Firestore
            const firestore = getFirestore();
            // Base de données (collection)  document participant
            // Récupération sur Firestore du participant via son id
            const docRef =  (firestore, "stades", id);
            // Référence du participant concerné
            this.refterrain = await getDoc(docRef);
            // Test si le participant demandé existe
            if(this.refTerrain.exists()){
                // Si oui on récupère ses données
                this.terrain = this.refTerrain.data();
                // Mémorisation photoActuelle
                this.photoActuelle = this.terrain.photo;
            }else{
                // Sinon simple message d'erreur
                this.console.log("Participant inexistant");
            }
            // Obtenir le Storage
            const storage = getStorage();
            // Référence de l'image du participant
            const spaceRef = ref(storage, 'stades/'+this.terrain.photo);
            // Récupération de l'url complète de l'image
            getDownloadURL(spaceRef)
                .then((url) => {
                    // Mise à jour de l'image prévisualisée
                    this.imageData = url;
            })
            .catch((error) =>{
                console.log('erreur downloadUrl', error);
            })
        },

        async createMatch(){
            // Obtenir storage Firebase
            const storage = getStorage();
            // Référence de l'image à uploader
            const refStorage = ref(storage, 'stade/'+this.match.photo);
            // Upload de l'image sur le Cloud Storage
            await uploadString(refStorage, this.imageData, 'data_url').then((snapshot) => {
                console.log('Uploaded a base64 string');
                
                // Création du participant sur le Firestore
                const db = getFirestore();
                const docRef = addDoc(collection(db, 'matchs'), this.match );
            });
            // redirection sur la liste des participants
            this.$router.push('/participants');            
        }
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


