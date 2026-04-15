// ============================================================
//  Firebase Configuration — QuantaNow Website
//  Fill in the values from your Firebase Console:
//  Firebase Console → Project Settings → Your Apps → Config
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "quantnow-website.firebaseapp.com",
  projectId:         "quantnow-website",
  storageBucket:     "quantnow-website.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
