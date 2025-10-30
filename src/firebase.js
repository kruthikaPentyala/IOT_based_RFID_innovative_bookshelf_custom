import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAXn1UvvsjmFR8GS61333V7ncKbJLYBg5w",
  authDomain: "rfid-bookshelf-tracking.firebaseapp.com",
  databaseURL: "https://rfid-bookshelf-tracking-default-rtdb.firebaseio.com",
  projectId: "rfid-bookshelf-tracking",
  storageBucket: "rfid-bookshelf-tracking.firebasestorage.app",
  messagingSenderId: "827119761047",
  appId: "1:827119761047:web:0bab7ddd81153afc9cdbd2",
  measurementId: "G-Z2XGP5F7RJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { database };