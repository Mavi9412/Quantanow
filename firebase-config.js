// ============================================================
//  Firebase Configuration — QuantaNow Website
//  Fill in the values from your Firebase Console:
//  Firebase Console → Project Settings → Your Apps → Config
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCYFUv1q0ZrCpL8LUcpnbP6yVnqNfeqQ08",
  authDomain:        "quantnow-website.firebaseapp.com",
  projectId:         "quantnow-website",
  storageBucket:     "quantnow-website.firebasestorage.app",
  messagingSenderId: "290308679127",
  appId:             "1:290308679127:web:2c00411e8822c27378d792"
};

const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
