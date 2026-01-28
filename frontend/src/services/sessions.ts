import type { Session } from "../types/Session";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:8080";

export type SessionFilters = {
  sport?: string;
  date?: string; // YYYY-MM-DD
  state?: string;
  city?: string;
};

export async function querySessions(
  filters: SessionFilters,
): Promise<Session[]> {
  const qs = new URLSearchParams();
  if (filters.sport) qs.set("sport", filters.sport);
  if (filters.date) qs.set("date", filters.date);
  if (filters.state) qs.set("state", filters.state);
  if (filters.city) qs.set("city", filters.city);

  const res = await fetch(`${API_BASE}/sessions?${qs.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`);
  return res.json();
}

export async function addSession(data: Session): Promise<string> {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to add session: ${res.status} ${msg}`);
  }
  const out = await res.json();
  return out.id as string;
}

// Optional seeding using API
export async function seedSampleSessions() {
  const samples: Session[] = [
    {
      sport: "tennis",
      date: "2026-02-01",
      state: "RI",
      city: "Providence",
      coachName: "Madeline Templeton",
      coachEmail: "madeline_templeton@brown.edu",
      coachExperience: "D1 soccer player at Brown",
      duration: 60,
      cost: 45,
      availableSlots: 3,
      createdAt: Date.now(),
    },
  ];
  for (const s of samples) await addSession(s);
}

export type BookingPayload = {
  playerName: string;
  playerEmail: string;
  playerPhoneNumber: string;
  playerAge: number;
  playerSkill: string;
  specificGoals: string;
  additionalComments: string;
};

export async function bookSession(
  id: string,
  payload: BookingPayload,
): Promise<void> {
  const res = await fetch(`${API_BASE}/sessions/${id}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to book session: ${res.status} ${msg}`);
  }
}
