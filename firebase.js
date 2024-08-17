// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAQAozt0accrBQQGkb1lOv-266Dm1S2Xs",
  authDomain: "ai-flash-cards-4df00.firebaseapp.com",
  projectId: "ai-flash-cards-4df00",
  storageBucket: "ai-flash-cards-4df00.appspot.com",
  messagingSenderId: "355862350716",
  appId: "1:355862350716:web:3a85dc742d9e25f583f2f9",
  measurementId: "G-L32DMNS72M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);