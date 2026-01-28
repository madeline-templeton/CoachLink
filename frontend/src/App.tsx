import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Dropdown, { Option } from "./components/Dropdown";
import DatePicker from "./components/DatePicker";
import LocationSelector, { LocationValue } from "./components/LocationSelector";
import Button from "./components/Button";
import {
  querySessions,
  bookSession,
  type BookingPayload,
} from "./services/sessions";
import type { Session } from "./types/Session";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [selection, setSelection] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location, setLocation] = useState<LocationValue>({
    state: "",
    city: "",
  });
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Session[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingPayload>({
    playerName: "",
    playerEmail: "",
    playerPhoneNumber: "",
    playerAge: 0,
    playerSkill: "",
    specificGoals: "",
    additionalComments: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const sportOptions: Option[] = [
    { label: "Select a sport", value: "", disabled: true },
    { label: "Tennis", value: "tennis" },
    { label: "Soccer", value: "soccer" },
    { label: "Basketball", value: "basketball" },
  ];
  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);
  return (
    <div className="app">
      <h1>CoachLink</h1>
      <p>{user ? `Signed in as ${user.email}` : "Not signed in"}</p>
      <div style={{ marginTop: 16 }}>
        <Dropdown
          label="Choose a sport"
          options={sportOptions}
          value={selection}
          onChange={setSelection}
        />
        {selection && <p style={{ marginTop: 8 }}>Selected: {selection}</p>}
      </div>
      <div style={{ marginTop: 16 }}>
        <DatePicker
          label="Select a date"
          value={selectedDate}
          onChange={setSelectedDate}
        />
        {selectedDate && <p style={{ marginTop: 8 }}>Date: {selectedDate}</p>}
      </div>
      <div style={{ marginTop: 16 }}>
        <LocationSelector
          label="Select location"
          value={location}
          onChange={setLocation}
        />
        {location.state && location.city && (
          <p style={{ marginTop: 8 }}>
            Location: {location.city}, {location.state}
          </p>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <Button
          loading={searching}
          onClick={async () => {
            setSearching(true);
            try {
              const sessions = await querySessions({
                sport: selection || undefined,
                date: selectedDate || undefined,
                state: location.state || undefined,
                city: location.city || undefined,
              });
              setResults(sessions);
            } finally {
              setSearching(false);
            }
          }}
        >
          find sessions for me
        </Button>
      </div>
      {!!results.length && (
        <div style={{ marginTop: 16 }}>
          <h2>Available sessions</h2>
          <ul>
            {results.map((s) => (
              <li key={s.id} style={{ marginBottom: 12 }}>
                <div>
                  <strong>{s.sport}</strong> — {s.city}, {s.state} — {s.date}
                  {s.coachName ? ` — Coach: ${s.coachName}` : ""}
                  {s.cost ? ` — $${s.cost}` : ""}
                  {!s.booked && (
                    <span style={{ marginLeft: 8 }}>
                      <Button
                        variant="success"
                        onClick={() => {
                          setBookingId(s.id || null);
                        }}
                      >
                        book
                      </Button>
                    </span>
                  )}
                  {s.booked && (
                    <span style={{ marginLeft: 8, color: "#16a34a" }}>
                      booked
                    </span>
                  )}
                </div>
                {bookingId === s.id && (
                  <form
                    style={{ marginTop: 8, display: "grid", gap: 8 }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!s.id) return;
                      setBookingLoading(true);
                      try {
                        await bookSession(s.id, booking);
                        // reflect locally
                        setResults((prev) =>
                          prev.map((it) =>
                            it.id === s.id
                              ? {
                                  ...it,
                                  booked: true,
                                  ...booking,
                                }
                              : it,
                          ),
                        );
                        setBookingId(null);
                        setBooking({
                          playerName: "",
                          playerEmail: "",
                          playerPhoneNumber: "",
                          playerAge: 0,
                          playerSkill: "",
                          specificGoals: "",
                          additionalComments: "",
                        });
                        alert("Booked! Coach will be emailed.");
                      } catch (err: any) {
                        alert(`Booking failed: ${err.message || err}`);
                      } finally {
                        setBookingLoading(false);
                      }
                    }}
                  >
                    <input
                      placeholder="Player name"
                      value={booking.playerName}
                      onChange={(e) =>
                        setBooking((b) => ({
                          ...b,
                          playerName: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Player email"
                      type="email"
                      value={booking.playerEmail}
                      onChange={(e) =>
                        setBooking((b) => ({
                          ...b,
                          playerEmail: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Player phone number"
                      value={booking.playerPhoneNumber}
                      onChange={(e) =>
                        setBooking((b) => ({
                          ...b,
                          playerPhoneNumber: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Player age"
                      type="number"
                      min={1}
                      value={booking.playerAge}
                      onChange={(e) =>
                        setBooking((b) => ({
                          ...b,
                          playerAge: Number(e.target.value || 0),
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Player skill"
                      value={booking.playerSkill}
                      onChange={(e) =>
                        setBooking((b) => ({
                          ...b,
                          playerSkill: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Specific goals"
                      value={booking.specificGoals}
                      onChange={(e) =>
                        setBooking((b) => ({
                          ...b,
                          specificGoals: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Additional comments"
                      value={booking.additionalComments}
                      onChange={(e) =>
                        setBooking((b) => ({
                          ...b,
                          additionalComments: e.target.value,
                        }))
                      }
                      required
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button type="submit" loading={bookingLoading}>
                        confirm booking
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setBookingId(null);
                        }}
                      >
                        cancel
                      </Button>
                    </div>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
