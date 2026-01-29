import "dotenv/config";
import { firestore } from "../firebase/admin";
async function main() {
    const snap = await firestore.collection("sessions").get();
    console.log(`Sessions count: ${snap.size}`);
    for (const doc of snap.docs) {
        const data = doc.data();
        const out = {
            id: doc.id,
            ...data,
            // serialize Firestore Timestamp for readability if present
            dateISO: data?.date && typeof data.date.toDate === "function"
                ? data.date.toDate().toISOString()
                : data.date,
        };
        console.log(JSON.stringify(out, null, 2));
    }
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
