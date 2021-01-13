import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDpec8oWXeFjFmMWY43MJxI5IDIZQDSd28",
    authDomain: "instagram-clone-react-cd4d3.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-cd4d3-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-cd4d3",
    storageBucket: "instagram-clone-react-cd4d3.appspot.com",
    messagingSenderId: "766179491152",
    appId: "1:766179491152:web:8f921655978e9dc2020055",
    measurementId: "G-T660W92W8L"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};