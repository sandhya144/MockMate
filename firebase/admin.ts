import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  // if (!apps.length) {

  //  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

  //   initializeApp({

  //     // credential: cert({
  //     //   projectId: process.env.FIREBASE_PROJECT_ID,
  //     //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //     //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  //     // }),
  //     credential: cert(serviceAccount),
  //   });
  // }


  if (!getApps().length) {

  console.log("SERVICE ACCOUNT KEY:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  const firebaseConfig = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (!firebaseConfig) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY env variable");
  }

  initializeApp({
    credential: cert(firebaseConfig),
  });
}


  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();