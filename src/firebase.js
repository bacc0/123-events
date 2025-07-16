import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
     apiKey: "AIzaSyA-Npbn1LwXLq2ISOfZqCIfl5MZJEGShnI",
     authDomain: "events-bf90b.firebaseapp.com",
     databaseURL: "https://events-bf90b-default-rtdb.europe-west1.firebasedatabase.app",
     projectId: "events-bf90b",
     storageBucket: "events-bf90b.firebasestorage.app",
     messagingSenderId: "594562087327",
     appId: "1:594562087327:web:34a93b80c3497e9c7de5aa"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, database, storage };