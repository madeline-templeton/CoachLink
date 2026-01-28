import { database } from "./firebase";
import { ref, onValue, get, set, push, serverTimestamp } from "firebase/database";

export async function getStatus() {
  const snap = await get(ref(database, "status"));
  return snap.exists() ? snap.val() : null;
}

export function subscribeBookings(callback: (val: unknown) => void) {
  const bookingsRef = ref(database, "bookings");
  return onValue(bookingsRef, (snap) => callback(snap.val()));
}

export async function createBooking(partial: Record<string, unknown>) {
  const id = push(ref(database, "bookings")).key as string;
  await set(ref(database, `bookings/${id}`), {
    ...partial,
    createdAt: serverTimestamp(),
  });
  return id;
}
