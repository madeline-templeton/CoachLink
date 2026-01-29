import { Router } from "express";
import { firestore } from "../firebase/admin.js";
import { z } from "zod";
import { SessionSchema } from "../schemas/session.js";
import { sendCoachEmail } from "../utils/email.js";
const router = Router();
// Accept filters via query string
const FiltersSchema = z.object({
    sport: z.string().optional(),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(), // YYYY-MM-DD
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
    let query = firestore.collection("sessions");
    if (sport)
        query = query.where("sport", "==", sport);
    if (state)
        query = query.where("state", "==", state);
    if (city)
        query = query.where("city", "==", city);
    if (date)
        query = query.where("dateStr", "==", date);
    const snap = await query.get();
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
// Booking endpoint: update player details and mark as booked
const BookingSchema = z.object({
    playerName: z.string().min(1),
    playerEmail: z.string().email(),
    playerPhoneNumber: z.string().min(7),
    playerAge: z.number().int().positive(),
    playerSkill: z.string().min(1),
    specificGoals: z.string().max(50),
    additionalComments: z.string().max(50),
    playerUserId: z.string().optional(),
});
router.post("/:id/book", async (req, res) => {
    const { id } = req.params;
    const parsed = BookingSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const docRef = firestore.collection("sessions").doc(id);
    const snap = await docRef.get();
    if (!snap.exists)
        return res.status(404).json({ error: "Not found" });
    const data = snap.data();
    if (data.booked)
        return res.status(409).json({ error: "Already booked" });
    const update = {
        ...parsed.data,
        booked: true,
    };
    await docRef.update(update);
    try {
        await sendCoachEmail({
            to: data.coachEmail,
            coachName: data.coachName,
            session: {
                sport: data.sport,
                dateStr: data.dateStr,
                time: data.time,
                city: data.city,
                state: data.state,
            },
            player: parsed.data,
        });
    }
    catch (e) {
        console.warn("Email send failed:", e);
    }
    res.json({ ok: true });
});
// Get user's sessions (coach or player)
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const { role } = req.query;
    if (!role || (role !== "coach" && role !== "player")) {
        return res.status(400).json({ error: "Invalid role parameter" });
    }
    try {
        const field = role === "coach" ? "coachUserId" : "playerUserId";
        const snap = await firestore
            .collection("sessions")
            .where(field, "==", userId)
            .get();
        const sessions = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.json(sessions);
    }
    catch (error) {
        console.error("Error fetching user sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});
// Delete session
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const docRef = firestore.collection("sessions").doc(id);
        const snap = await docRef.get();
        if (!snap.exists) {
            return res.status(404).json({ error: "Session not found" });
        }
        await docRef.delete();
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ error: "Failed to delete session" });
    }
});
export default router;
