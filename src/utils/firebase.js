import firebase from "firebase";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDQUv-trpHTWJ-JLmn2hhHlgaYceDy90k",
  authDomain: "expense-tracker-app-a470a.firebaseapp.com",
  projectId: "expense-tracker-app-a470a",
  storageBucket: "expense-tracker-app-a470a.appspot.com",
  messagingSenderId: "831365132001",
  appId: "1:831365132001:web:4657957273239ead1c11a0",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage, firebase };
