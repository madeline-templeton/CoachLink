import { Router } from "express";
import { firestore } from "../firebase/admin";
import { z } from "zod";
import { SessionSchema } from "../schemas/session";
import { sendCoachEmail } from "../utils/email";

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

type SessionInput = z.infer<typeof SessionInputSchema>;

router.get("/", async (req, res) => {
  const parse = FiltersSchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }
  const { sport, date, state, city } = parse.data;

  let col = firestore.collection("sessions");
  const constraints: Array<[string, FirebaseFirestore.WhereFilterOp, unknown]> =
    [];
  if (sport) constraints.push(["sport", "==", sport]);
  if (state) constraints.push(["state", "==", state]);
  if (city) constraints.push(["city", "==", city]);
  if (date) constraints.push(["dateStr", "==", date]);

  for (const [f, op, v] of constraints) {
    col = col.where(f, op, v);
  }

  const snap = await col.get();
  const items = snap.docs.map((d) => {
    const data = d.data();
    // Convert Firestore Timestamp date back to ISO string for client ergonomics
    const dateStr = data.dateStr as string | undefined;
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
  const session: SessionInput = parsed.data;
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

// Booking endpoint: update player details and mark as booked
const BookingSchema = z.object({
  playerName: z.string().min(1),
  playerEmail: z.string().email(),
  playerPhoneNumber: z.string().min(7),
  playerAge: z.number().int().positive(),
  playerSkill: z.string().min(1),
  specificGoals: z.string().max(50),
  additionalComments: z.string().max(50),
});

router.post("/:id/book", async (req, res) => {
  const { id } = req.params;
  const parsed = BookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const docRef = firestore.collection("sessions").doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: "Not found" });

  const data = snap.data() as any;
  if (data.booked) return res.status(409).json({ error: "Already booked" });

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
  } catch (e) {
    console.warn("Email send failed:", e);
  }

  res.json({ ok: true });
});
