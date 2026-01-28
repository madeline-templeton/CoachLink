import { z } from "zod";
export const SessionSchema = z.object({
    date: z.date(),
    sport: z.string(),
    // HH:MM format, 24-hour clock, no seconds
    time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
    state: z.string().min(1),
    city: z.string().min(1),
    duration: z.number().int().positive(),
    cost: z.number().positive(),
    booked: z.boolean(),
    coachNote: z.string().max(50),
    playerName: z.string().min(1),
    playerEmail: z.string().email(),
    playerPhoneNumber: z.string().min(7),
    playerAge: z.number().int().positive(),
    playerSkill: z.string().min(1),
    specificGoals: z.string().max(50),
    additionalComments: z.string().max(50),
});
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyApCgkxjANvtWt7E0sy1Ly60rlBK1UToKU",
    authDomain: "coachlink-ffd05.firebaseapp.com",
    databaseURL: "https://coachlink-ffd05-default-rtdb.firebaseio.com",
    projectId: "coachlink-ffd05",
    storageBucket: "coachlink-ffd05.firebasestorage.app",
    messagingSenderId: "875851615998",
    appId: "1:875851615998:web:942ee9cbea296608759faf",
    measurementId: "G-9BCKEZ17CE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
