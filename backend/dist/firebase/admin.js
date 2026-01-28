import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL;
if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin env vars");
}
privateKey = privateKey.replace(/\\n/g, "\n");
admin.initializeApp({
    credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
    }),
    ...(databaseURL ? { databaseURL } : {}),
});
export const adminApp = admin.app();
export const firestore = getFirestore();
export const storage = getStorage();
export const rtdb = getDatabase();
