import { Router } from "express";
import { firestore } from "../firebase/admin";
const router = Router();
router.get("/", async (_req, res) => {
    const snapshot = await firestore.collection("users").limit(1).get();
    res.json({ count: snapshot.size });
});
export default router;
