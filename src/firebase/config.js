// Import the functions you need from the SDKs you need
import { appBarClasses } from "@mui/material";
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB6jGxG5Q2i6Yu6wcrFWBq3KO0mz1DJlc0",
  authDomain: "frustration-2a727.firebaseapp.com",
  projectId: "frustration-2a727",
  storageBucket: "frustration-2a727.appspot.com",
  messagingSenderId: "696480789335",
  appId: "1:696480789335:web:8baba30e90b8f1e4604412"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const db = getFirestore(app)