<template>
            <form class="flex flex-col items-center mb-[96px]" @submit.prevent="onCnx()">
                <img src="../assets/logo.png" alt="" class="my-[100px] w-[90%] h-auto">
                <input class="form-control w-9/12" id="email" type="text" v-model="user.email" placeholder="E-mail" required />
                <div class="h-px w-9/12 bg-black my-[10px]"></div>
                <div class="flex flex-row justify-between w-9/12">
                    <input class="form-control" type="password" v-model="user.password" placeholder="Mot de passe"/>
                    <button class="justify-self-end place-self-end" @click="onForgot()">
                        Oublié ?
                    </button>
                </div>
                
                <button class="float-right h-[52px] w-11/12 bg-green-400 mt-[40px] rounded-full text-white" type="submit">
                    Se connecter
                </button>

                <div class="h-[32px] mt-[20px] alert alert-warning text-center mb-3" v-if="message!=null" >
                    {{ message }}
                </div>
                
                <button class="float-right h-[52px] w-11/12 bg-blue-800 mt-[40px] rounded-full text-white" @click="onFacebookCnx()">
                    Se connecter avec Facebook
                </button>
                
                <RouterLink to="/account/create" class="h-[52px] w-11/12 bg-gray-800 mt-[20px] rounded-full pt-[15px] text-white text-center content-center items-center">
                    Créer un compte
                </RouterLink>
            </form>
            <hr class='mb-5' style='clear:both'/>
</template>
          
<script>
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, FacebookAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'

import { emitter } from '../main.js'

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
                    this.$router.push("/join");
                }else{
                    this.message = "";
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
                    emitter.emit('conected User', { user : this.user });
                    this.message = "User connecté : "+this.user.email;
                    this.$router.push("/join");
                })
                .catch((error) =>{
                    // Erreur de connexion
                    if (error.code == 'auth/wrong-password')
                    {
                        this.message = "Le mot de passe est incorrect";
                    }
                    else if  (error.code == 'auth/invalid-email')
                    {
                        this.message = "Le compte n'existe pas";
                    }
                    else
                    {
                        this.message = "Erreur d'authentification, veuillez réessayer plus tard";
                    }
                    console.log('Erreur connexion', error.code);
                })
            },
            onFacebookCnx()
            {
                const provider = new FacebookAuthProvider();
                provider.setCustomParameters({
                    'display': 'popup'
                });
                const auth = getAuth();
                signInWithPopup(auth, provider)
                .then((result) => {
                    // The signed-in user info.
                    const user = result.user;

                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    const credential = FacebookAuthProvider.credentialFromResult(result);
                    const accessToken = credential.accessToken;
                    this.$router.push("/join");

                    console.log('Erreur connexion', result);
                    // ...
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = FacebookAuthProvider.credentialFromError(error);

                    console.log('Erreur connexion', error);
                    // ...
                });
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
            onForgot(){  
                sendPasswordResetEmail(getAuth(), this.user.email)
                .then(() => {      
                    this.message = 'E-mail envoyé à ' + this.user.email;
                    // Password reset email sent!
                    // ..
                })
                .catch((error) => {
                    this.message = "Erreur de l'envoie de l'e-mail, le compte existe-t-il ?";
                    // ..
                });
            }

        }
    }
</script>



