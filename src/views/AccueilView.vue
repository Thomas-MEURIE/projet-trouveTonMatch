<template>
    <div class="flex flex-col justify-items-center">
            <img src="../../public/logo.png" alt="" class="my-8 w-auto h-auto">

            
            <form @submit.prevent="onCnx()">
                <div class="input-group mb-3">
                    <label for="email">Email</label>
                    <input class="form-control" id="email" type="text" v-model="user.email" required />
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <button  class="btn btn-dark">Mot de passe :</button>
                    </div>
                    <input class="form-control" type="password" v-model="user.password" required />
                </div>
                <div class="alert alert-warning text-center mb-3" v-if="message!=null" >
                    {{ message }}
                </div>
                <div>
                    <button class="float-left" @click="onDcnx()">
                        Deconnexion
                    </button>
                    <button variant="dark" class="float-right" type="submit">
                        Connexion
                    </button>
                </div>
            </form>
            <hr class='mb-5' style='clear:both'/>

    </div>
</template>
          
<script>
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'

    export default {   
        data(){ // Données de la vue
            return{                
                user:{          // user se connectant
                    email:null,
                    password:null
                },
                message:null, // Message de connexion
            }
        },

        mounted(){ // Montage de la vue
            // Rechercher si un user est déjà connecté
                let user = getAuth().currentUser;
                if(user){
                    this.user = user;
                    this.message = "User déjà connecté : "+this.user.email;
                }else{
                    this.message = "User non connecté : "+this.user.email;
                }
        },

        methods:{
            onCnx(){                
                // Se connecter avec user et mot de passe           
                signInWithEmailAndPassword(getAuth(), this.user.email, this.user.password)
                .then((response)=>{
                    // Connexion OK
                    console.log('user connecté', response.user);
                    this.user = response.user;
                    this.message = "User connecté : "+this.user.email;
                })
                .catch((error) =>{
                    // Erreur de connexion
                    console.log('Erreur connexion', error);
                    this.message = "Erreur d'authentification";
                })
            },
            onDcnx(){
                // Se déconnecter
                signOut(getAuth())
                .then(response =>{
                    this.user = getAuth().currentUser;
                    this.user = {
                        email:null,
                        password:null
                    };
                    console.log("user deconnecté ", this.user);        
                    this.message = 'user non connecté';
                })
                .catch(error=>{
                    console.log('erreur deconnexion ', error);
                })

            },

        }
    }
</script>



