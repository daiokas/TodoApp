import firebase from 'firebase'
require("firebase/firestore")

const firebaseConfig = {
    apiKey: "AIzaSyBZi546UyOhrVFapmdTqa7bfUBC-W5nGeU",
    authDomain: "todoapp-38d4b.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "todoapp-38d4b",
    storageBucket: "todoapp-38d4b.appspot.com",
    messagingSenderId: "51953091373",
    appId: "1:51953091373:web:5d7171132f19485e8fc9a4",
    measurementId: "G-measurement-id"
};

const Firebase =firebase.initializeApp(firebaseConfig)

export default Firebase
