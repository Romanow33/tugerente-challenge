// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  onSnapshot,
  query,
  collection,
  addDoc,
  orderBy,
  getDocs,
  limit,
  startAfter,
  endAt,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUw3dHPbabz-1hHh5ppXx1CsCMhyshGnw",
  authDomain: "tugerente-challenge-crud.firebaseapp.com",
  projectId: "tugerente-challenge-crud",
  storageBucket: "tugerente-challenge-crud.appspot.com",
  messagingSenderId: "500267521570",
  appId: "1:500267521570:web:ad025ed6dd6f3120075c7b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
let lastVisible = [];
let response = [];

export async function getClients() {
  const first = query(
    collection(db, "clients"),
    orderBy("nombre", "asc"),
    limit(20)
  );
  const documentSnapshots = await getDocs(first);
  if (documentSnapshots) {
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    documentSnapshots.forEach((e) => {
      return response.push({ ...e.data(), id: e.id });
    });
  }
  return response;
}

// Get the last visible document
export async function getNextClients() {
  if (lastVisible !== undefined) {
    const next = query(
      collection(db, "clients"),
      orderBy("nombre", "asc"),
      startAfter(lastVisible),
      limit(20)
    );
    const documentSnapshots = await getDocs(next);
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    documentSnapshots.forEach((e) => {
      return response.push({ ...e.data(), id: e.id });
    });
    return response;
  } else {
    return false;
  }
}

export async function postClient(clientObject) {
  const docRef = await addDoc(collection(db, "clients"), clientObject);
  return docRef.id;
}
