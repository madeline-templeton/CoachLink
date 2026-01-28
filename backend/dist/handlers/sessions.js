import { Router } from "express";
import { firestore } from "../firebase/admin";
import { z } from "zod";
import { SessionSchema } from "../../globals";
const router = Router();
// Accept filters via query string
const FiltersSchema = z.object({
    sport: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD
    state: z.string().optional(),
    city: z.string().optional(),
});
// Coerce `date` to Date while keeping validation consistent with SessionSchema
const SessionInputSchema = SessionSchema.extend({
    date: z.coerce.date(),
});
router.get("/", async (req, res) => {
    const parse = FiltersSchema.safeParse(req.query);
    if (!parse.success) {
        return res.status(400).json({ error: parse.error.flatten() });
    }
    const { sport, date, state, city } = parse.data;
    let col = firestore.collection("sessions");
    const constraints = [];
    if (sport)
        constraints.push(["sport", "==", sport]);
    if (state)
        constraints.push(["state", "==", state]);
    if (city)
        constraints.push(["city", "==", city]);
    if (date)
        constraints.push(["dateStr", "==", date]);
    for (const [f, op, v] of constraints) {
        col = col.where(f, op, v);
    }
    const snap = await col.get();
    const items = snap.docs.map((d) => {
        const data = d.data();
        // Convert Firestore Timestamp date back to ISO string for client ergonomics
        const dateStr = data.dateStr;
        return {
            id: d.id,
            ...data,
            date: dateStr ?? data.date, // prefer dateStr (YYYY-MM-DD)
        };
    });
    res.json(items);
});
router.post("/", async (req, res) => {
    const parsed = SessionInputSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const session = parsed.data;
    const dateStr = session.date.toISOString().slice(0, 10); // YYYY-MM-DD
    const payload = {
        ...session,
        date: session.date,
        dateStr,
        createdAt: Date.now(),
    };
    const docRef = await firestore.collection("sessions").add(payload);
    res.status(201).json({ id: docRef.id, ...payload });
});
export default router;
