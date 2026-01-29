import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserSessions, deleteSession } from "../services/sessions";
import type { Session } from "../types/Session";
import Button from "../components/Button";

export function CoachDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const formatDate = (date: any): string => {
    if (typeof date === "string") return date;
    if (date?._seconds) {
      return new Date(date._seconds * 1000).toISOString().split("T")[0];
    }
    return "N/A";
  };

  const loadSessions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getUserSessions(user.uid, "coach");
      setSessions(data || []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user]);

  const handleDelete = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    setDeleting(sessionId);
    try {
      await deleteSession(sessionId);
      setSessions(sessions.filter((s) => s.id !== sessionId));
      alert("Session deleted successfully!");
    } catch (error: any) {
      alert(`Failed to delete session: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your sessions...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Coach Dashboard</h2>
      <p className="dashboard-subtitle">Manage your sessions and bookings</p>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any sessions yet.</p>
          <p>Go to the home page to add your first session!</p>
        </div>
      ) : (
        <div className="dashboard-sessions">
          {sessions.map((session) => (
            <div key={session.id} className="dashboard-session-card">
              <div className="session-header">
                <h3>{session.sport}</h3>
                <span
                  className={`session-status ${session.booked ? "booked" : "available"}`}
                >
                  {session.booked ? "Booked" : "Available"}
                </span>
              </div>

              <div className="session-info">
                <div className="info-row">
                  <span className="label">Date:</span>
                  <span>{formatDate(session.date)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Location:</span>
                  <span>
                    {session.city}, {session.state}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Duration:</span>
                  <span>{session.duration || "N/A"} minutes</span>
                </div>
                <div className="info-row">
                  <span className="label">Cost:</span>
                  <span>${session.cost || "N/A"}</span>
                </div>
              </div>

              {session.booked && (
                <div className="booking-details">
                  <h4>Booking Details</h4>
                  <div className="info-row">
                    <span className="label">Player:</span>
                    <span>{session.playerName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span>{session.playerEmail}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span>{session.playerPhoneNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Age:</span>
                    <span>{session.playerAge}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Skill Level:</span>
                    <span>{session.playerSkill}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Goals:</span>
                    <span>{session.specificGoals}</span>
                  </div>
                </div>
              )}

              <div className="session-actions">
                <Button
                  onClick={() => handleDelete(session.id!)}
                  loading={deleting === session.id}
                  variant="danger"
                >
                  Delete Session
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoachDashboard;
