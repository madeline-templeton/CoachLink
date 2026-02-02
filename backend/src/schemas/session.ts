import { z } from "zod";

// Valid US state codes
const VALID_STATE_CODES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

export const SessionSchema = z.object({
  date: z.date(),

  sport: z.string(),

  // HH:MM format, 24-hour clock, no seconds
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),

  state: z.enum(VALID_STATE_CODES, {
    message: "Invalid state code",
  }),
  city: z.string().min(1),

  duration: z.number().int().positive(),

  cost: z.number().positive(),

  booked: z.boolean(),

  coachNote: z.string().max(50),

  // Coach details
  coachName: z.string().min(1),
  coachEmail: z.string().email(),
  coachExperience: z.string().min(1),
  coachUserId: z.string().optional(),

  playerName: z.string().min(1),

  playerEmail: z.string().email(),

  playerPhoneNumber: z.string().min(7),

  playerAge: z.number().int().positive(),

  playerSkill: z.string().min(1),

  specificGoals: z.string().max(50),

  additionalComments: z.string().max(50),

  playerUserId: z.string().optional(),
});
