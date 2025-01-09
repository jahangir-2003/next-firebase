// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRES46aD-SI74SZ_Q3Lse9kENxGMRCCUQ",
  authDomain: "next-firebase-51f35.firebaseapp.com",
  projectId: "next-firebase-51f35",
  storageBucket: "next-firebase-51f35.firebasestorage.app",
  messagingSenderId: "614256348691",
  appId: "1:614256348691:web:3030e3076060f8077f39e6",
  measurementId: "G-6CLBB3V6E0",
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(firebase_app);
