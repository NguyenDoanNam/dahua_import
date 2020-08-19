import firebase from "firebase";
import "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbh-Cjg1AONRQMphOB9uC1T81zSQQs9ps",
  authDomain: "dahua-77ba2.firebaseapp.com",
  databaseURL: "https://dahua-77ba2.firebaseio.com",
  projectId: "dahua-77ba2",
  storageBucket: "dahua-77ba2.appspot.com",
  messagingSenderId: "1072182258995",
  appId: "1:1072182258995:web:796641f8f37d9521daa246",
  measurementId: "G-EH6S0GVNLK",
};

firebase.initializeApp(firebaseConfig);

const firebaseDB = firebase.database();

export { firebase, firebaseDB };
