import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export type UserRole = "player" | "coach";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
};

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as UserProfile;
}

export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string,
  role: UserRole,
): Promise<void> {
  const profile: UserProfile = {
    uid,
    email,
    displayName,
    role,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "users", uid), profile);
}

export async function updateUserRole(
  uid: string,
  role: UserRole,
): Promise<void> {
  await setDoc(doc(db, "users", uid), { role }, { merge: true });
}
