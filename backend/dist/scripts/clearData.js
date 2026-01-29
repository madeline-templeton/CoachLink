import "dotenv/config";
import { firestore, rtdb } from "../firebase/admin";
async function clearFirestoreCollection(collectionPath) {
    const col = firestore.collection(collectionPath);
    const snap = await col.get();
    if (snap.empty) {
        console.log(`No documents found in ${collectionPath}.`);
        return;
    }
    const batchSize = 250;
    const docs = snap.docs;
    console.log(`Deleting ${docs.length} docs from ${collectionPath}...`);
    for (let i = 0; i < docs.length; i += batchSize) {
        const batch = firestore.batch();
        for (const d of docs.slice(i, i + batchSize)) {
            batch.delete(d.ref);
        }
        await batch.commit();
        console.log(`Deleted ${Math.min(i + batchSize, docs.length)} / ${docs.length}`);
    }
}
async function clearRealtimeBookings(path) {
    try {
        await rtdb.ref(path).remove();
        console.log(`Cleared RTDB path: ${path}`);
    }
    catch (err) {
        console.warn(`RTDB clear skipped: ${path}:`, err);
    }
}
async function main() {
    await clearFirestoreCollection("sessions");
    await clearRealtimeBookings("/bookings");
    console.log("Clear complete.");
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
