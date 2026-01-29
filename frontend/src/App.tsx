import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useAuth } from "./contexts/AuthContext";
import Dropdown, { Option } from "./components/Dropdown";
import DatePicker from "./components/DatePicker";
import LocationSelector, { LocationValue } from "./components/LocationSelector";
import Button from "./components/Button";
import SessionCard from "./components/SessionCard";
import AuthButton from "./components/AuthButton";
import RoleSelector from "./components/RoleSelector";
import NavBar from "./components/NavBar";
import CoachDashboard from "./pages/CoachDashboard";
import PlayerDashboard from "./pages/PlayerDashboard";
import {
  querySessions,
  bookSession,
  addSession,
  type BookingPayload,
} from "./services/sessions";
import type { Session } from "./types/Session";
import "./styles.css";

export default function App() {
  const { user, userProfile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<"home" | "dashboard">("home");
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
  const [showCoachForm, setShowCoachForm] = useState(false);
  const [coachSession, setCoachSession] = useState({
    date: "",
    sport: "",
    time: "",
    state: "",
    city: "",
    duration: 0,
    cost: 0,
    coachNote: "",
    coachName: "",
    coachEmail: "",
    coachExperience: "",
  });
  const [addingSession, setAddingSession] = useState(false);
  const sportOptions: Option[] = [
    { label: "Select a sport", value: "", disabled: true },
    { label: "Tennis", value: "tennis" },
    { label: "Soccer", value: "soccer" },
    { label: "Basketball", value: "basketball" },
  ];

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <RoleSelector />

      <div className="header">
        <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
        <AuthButton />
      </div>

      {currentPage === "dashboard" ? (
        userProfile?.role === "coach" ? (
          <CoachDashboard />
        ) : userProfile?.role === "player" ? (
          <PlayerDashboard />
        ) : (
          <div className="empty-state">
            Please sign in to view your dashboard
          </div>
        )
      ) : (
        <>
          <div className="hero-section">
            <h1 className="app-title">CoachLink</h1>
            <p className="welcome-text">
              Welcome to CoachLink! Use the "Find sessions for me" to book your
              next training session with a coach near you!
            </p>
          </div>

          <h2 className="section-title">Find Your Next Session</h2>

          <div className="search-form">
            <Dropdown
              label="Choose a sport"
              options={sportOptions}
              value={selection}
              onChange={setSelection}
              placeholder="sport"
            />

            <DatePicker
              label="Select a date"
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <LocationSelector
              label="Select a location"
              value={location}
              onChange={setLocation}
            />

            <Button
              loading={searching}
              onClick={async () => {
                if (!location.state) {
                  alert(
                    "Please offer at least a state to see available sessions.",
                  );
                  return;
                }
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
              Find Session
            </Button>
          </div>

          {userProfile?.role === "coach" && (
            <>
              <div className="coach-prompt">
                <p>
                  <button
                    className="link-button"
                    onClick={() => setShowCoachForm(!showCoachForm)}
                  >
                    {showCoachForm ? "Hide" : "Click HERE to add sessions"}
                  </button>
                </p>
              </div>

              {showCoachForm && (
                <div className="coach-form-section">
                  <h2 className="section-title">Add a New Session</h2>
                  <form
                    className="coach-form"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAddingSession(true);
                      try {
                        const sessionData = {
                          date: coachSession.date,
                          sport: coachSession.sport,
                          time: coachSession.time,
                          state: coachSession.state,
                          city: coachSession.city,
                          duration: coachSession.duration,
                          cost: coachSession.cost,
                          booked: false,
                          coachNote: coachSession.coachNote,
                          coachName: coachSession.coachName,
                          coachEmail: coachSession.coachEmail,
                          coachExperience: coachSession.coachExperience,
                          coachUserId: user?.uid,
                          playerName: "playerName",
                          playerEmail: "player@email.com",
                          playerPhoneNumber: "0000000",
                          playerAge: 1,
                          playerSkill: "N/A",
                          specificGoals: "N/A",
                          additionalComments: "N/A",
                        };
                        await addSession(sessionData);
                        alert("Session added successfully!");
                        setCoachSession({
                          date: "",
                          sport: "",
                          time: "",
                          state: "",
                          city: "",
                          duration: 0,
                          cost: 0,
                          coachNote: "",
                          coachName: "",
                          coachEmail: "",
                          coachExperience: "",
                        });
                        setShowCoachForm(false);
                      } catch (err: any) {
                        alert(`Failed to add session: ${err.message || err}`);
                      } finally {
                        setAddingSession(false);
                      }
                    }}
                  >
                    <input
                      placeholder="Date (YYYY-MM-DD)"
                      type="date"
                      value={coachSession.date}
                      onChange={(e) =>
                        setCoachSession((s) => ({ ...s, date: e.target.value }))
                      }
                      required
                    />
                    <input
                      placeholder="Sport"
                      value={coachSession.sport}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          sport: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Time (HH:MM)"
                      type="time"
                      value={coachSession.time}
                      onChange={(e) =>
                        setCoachSession((s) => ({ ...s, time: e.target.value }))
                      }
                      required
                    />
                    <input
                      placeholder="State"
                      value={coachSession.state}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          state: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="City"
                      value={coachSession.city}
                      onChange={(e) =>
                        setCoachSession((s) => ({ ...s, city: e.target.value }))
                      }
                      required
                    />
                    <input
                      placeholder="Duration (minutes)"
                      type="number"
                      min={1}
                      value={coachSession.duration || ""}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          duration: Number(e.target.value || 0),
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Cost (USD)"
                      type="number"
                      min={0}
                      step="0.01"
                      value={coachSession.cost || ""}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          cost: Number(e.target.value || 0),
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Coach Note (max 50 characters)"
                      maxLength={50}
                      value={coachSession.coachNote}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          coachNote: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Coach Name"
                      value={coachSession.coachName}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          coachName: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Coach Email"
                      type="email"
                      value={coachSession.coachEmail}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          coachEmail: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      placeholder="Coach Experience"
                      value={coachSession.coachExperience}
                      onChange={(e) =>
                        setCoachSession((s) => ({
                          ...s,
                          coachExperience: e.target.value,
                        }))
                      }
                      required
                    />
                    <Button type="submit" loading={addingSession}>
                      Confirm Session
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}

          {!!results.length && (
            <div className="results-section">
              <h2>Available Sessions</h2>
              <div className="session-list">
                {results.map((s) => (
                  <div key={s.id} className="session-item">
                    <SessionCard
                      session={s}
                      onBook={() => {
                        if (!user) {
                          alert("Please sign in to book a session");
                          return;
                        }
                        if (userProfile?.role !== "player") {
                          alert("Only players can book sessions");
                          return;
                        }
                        setBookingId(s.id || null);
                      }}
                      isBooked={s.booked}
                    />
                    {bookingId === s.id && (
                      <form
                        className="booking-form"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!s.id) return;
                          setBookingLoading(true);
                          try {
                            await bookSession(s.id, {
                              ...booking,
                              playerUserId: user?.uid,
                            });
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
                          placeholder="Player age (use the arrows)"
                          type="number"
                          min={1}
                          value={booking.playerAge || ""}
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
                        <div className="button-group">
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
