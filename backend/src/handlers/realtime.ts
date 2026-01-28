import { Router } from "express";
import { rtdb } from "../firebase/admin";

const router = Router();

// Basic health and sample read
router.get("/status", async (_req, res) => {
  const ref = rtdb.ref("status");
  const snap = await ref.get();
  res.json({ exists: snap.exists(), value: snap.val() ?? null });
});

// List bookings (first 50)
router.get("/bookings", async (_req, res) => {
  const ref = rtdb.ref("bookings");
  const snap = await ref.limitToFirst(50).get();
  res.json(snap.val() ?? {});
});

// Create a booking (minimal fields)
router.post("/bookings", async (req, res) => {
  const booking = req.body ?? {};
  // Minimal required fields check
  if (!booking.playerName || !booking.date || !booking.time) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const id = rtdb.ref().push().key as string;
  await rtdb.ref(`bookings/${id}`).set({
    ...booking,
    createdAt: Date.now(),
  });
  res.status(201).json({ id });
});

export default router;
