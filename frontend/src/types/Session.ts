export type Session = {
  id?: string;
  sport: string; // e.g., 'tennis'
  date: string; // YYYY-MM-DD
  state: string; // e.g., 'RI'
  city: string; // e.g., 'Providence'
  coachName?: string;
  coachEmail?: string;
  coachExperience?: string;
  skill?: string; // e.g., 'beginner', 'intermediate', 'advanced'
  duration?: number; // minutes
  cost?: number; // USD
  availableSlots?: number;
  createdAt?: number;
  booked?: boolean;
  coachUserId?: string;
  playerUserId?: string;
  playerName?: string;
  playerEmail?: string;
  playerPhoneNumber?: string;
  playerAge?: number;
  playerSkill?: string;
  specificGoals?: string;
  additionalComments?: string;
};
