import firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyCMxJTTDFX57-sRBahmCOK0KzLppHvZu9g",
    authDomain: "discordclone-8538a.firebaseapp.com",
    databaseURL: "https://discordclone-8538a.firebaseio.com",
    projectId: "discordclone-8538a",
    storageBucket: "discordclone-8538a.appspot.com",
    messagingSenderId: "113088370666",
    appId: "1:113088370666:web:90a68a375eeb0af8520493",
    measurementId: "G-V4YH1X7JCM"
  };

  const firebaseApp=firebase.initializeApp(firebaseConfig);
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const provider=new firebase.auth.GoogleAuthProvider();


  export {auth,provider};
  export default db;