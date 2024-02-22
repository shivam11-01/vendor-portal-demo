import { auth, db } from "../firebase.config";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

export const BASE_URL = "https://vendor-automailer.vercel.app"
export const BASE_URL_LOCAL = "http://localhost:8000"

export const setDocument = async (collectionName, uid, data) => {
    await setDoc(doc(db, collectionName, uid), data, { merge: true });
}

export const updateDocument = async (collectionName, uid, data) => {
    await updateDoc(doc(db, collectionName, uid), data, { merge: true });
}

export const getDocument = async (collectionName, uid) => {
    const docRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(docRef);
    var docdata;

    if (docSnap.exists()) {
        docdata = docSnap.data();
    } else {
        console.log("No such document!");
    }

    return docdata;
}
