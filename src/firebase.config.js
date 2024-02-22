import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALbAdbwePWe8StFxmqpu1lzPmzvy_SIqY",
    authDomain: "omg-vendor-portal-demo.firebaseapp.com",
    projectId: "omg-vendor-portal-demo",
    storageBucket: "omg-vendor-portal-demo.appspot.com",
    messagingSenderId: "297100122751",
    appId: "1:297100122751:web:178dd198a6007cc5d6fd4a",
    measurementId: "G-0YYPNF1558"
    };

const app = initializeApp(firebaseConfig, "OMG Vendor Portal Demo");
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

const introducerfirebaseConfig = {
    apiKey: "AIzaSyALbAdbwePWe8StFxmqpu1lzPmzvy_SIqY",
    authDomain: "omg-vendor-portal-demo.firebaseapp.com",
    projectId: "omg-vendor-portal-demo",
    storageBucket: "omg-vendor-portal-demo.appspot.com",
    messagingSenderId: "297100122751",
    appId: "1:297100122751:web:9da6e041bc762e29d6fd4a",
    measurementId: "G-SGT0C8VMD0"
    };
    

const introapp = initializeApp(introducerfirebaseConfig, "OMG Vendor Portal Introducer");
const introauth = getAuth(introapp);


export {
    auth, storage, db, introauth
}