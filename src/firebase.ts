import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"


const config = {
    apiKey: "AIzaSyCHrbsyHCpDtoKrOg6FuPJDTfV2eI8yeTE",
    authDomain: "fugalist.firebaseapp.com",
    databaseURL: "https://fugalist.firebaseio.com",
    projectId: "fugalist",
    storageBucket: "fugalist.appspot.com",
    messagingSenderId: "52283527895",
    appId: "1:52283527895:web:45fe605113c3e3a9275692"
}
export const firebaseApp = firebase.initializeApp(config)
export const auth = firebase.auth()
export const db = firebase.firestore(firebaseApp)

export type DocumentReference = firebase.firestore.DocumentReference
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
export type Timestamp = firebase.firestore.Timestamp
export type User = firebase.User
export type FieldValue = firebase.firestore.FieldValue

export const GoogleAuthProvider = firebase.auth.GoogleAuthProvider
export const EmailAuthProvider = firebase.auth.EmailAuthProvider

export const SERVER_TIMESTAMP = firebase.firestore.FieldValue.serverTimestamp()
export const DELETE = firebase.firestore.FieldValue.delete()

if (window.location.hostname === 'localhost') {
    // @ts-ignore
    db.useEmulator("localhost", 8080)
}


