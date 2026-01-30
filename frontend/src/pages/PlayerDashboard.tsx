import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserSessions } from "../services/sessions";
import type { Session } from "../types/Session";

export function PlayerDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

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
      const data = await getUserSessions(user.uid, "player");
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

  const upcomingSessions = sessions.filter((s) => {
    const dateStr = formatDate(s.date);
    const timeStr = s.time || "00:00";
    const sessionDateTime = new Date(`${dateStr}T${timeStr}`);
    return sessionDateTime >= new Date();
  });

  const pastSessions = sessions.filter((s) => {
    const dateStr = formatDate(s.date);
    const timeStr = s.time || "00:00";
    const sessionDateTime = new Date(`${dateStr}T${timeStr}`);
    return sessionDateTime < new Date();
  });

  if (loading) {
    return <div className="dashboard-loading">Loading your sessions...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Player Dashboard</h2>
      <p className="dashboard-subtitle">Your booked sessions</p>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any sessions yet.</p>
          <p>Go to the home page to find and book sessions!</p>
        </div>
      ) : (
        <>
          {upcomingSessions.length > 0 && (
            <div className="dashboard-section">
              <h3>Upcoming Sessions</h3>
              <div className="dashboard-sessions">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="dashboard-session-card">
                    <div className="session-header">
                      <h3>{session.sport}</h3>
                      <span className="session-badge upcoming">Upcoming</span>
                    </div>

                    <div className="session-info">
                      <div className="info-row">
                        <span className="label">Date:</span>
                        <span>{formatDate(session.date)}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Time:</span>
                        <span>{session.time || "N/A"}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Location:</span>
                        <span>
                          {session.city}, {session.state}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Coach:</span>
                        <span>{session.coachName}</span>
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

                    <div className="coach-contact">
                      <h4>Coach Contact</h4>
                      <div className="info-row">
                        <span className="label">Email:</span>
                        <span>{session.coachEmail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastSessions.length > 0 && (
            <div className="dashboard-section">
              <h3>Past Sessions</h3>
              <div className="dashboard-sessions">
                {pastSessions.map((session) => (
                  <div key={session.id} className="dashboard-session-card past">
                    <div className="session-header">
                      <h3>{session.sport}</h3>
                      <span className="session-badge past">Completed</span>
                    </div>

                    <div className="session-info">
                      <div className="info-row">
                        <span className="label">Date:</span>
                        <span>{formatDate(session.date)}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Time:</span>
                        <span>{session.time || "N/A"}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Location:</span>
                        <span>
                          {session.city}, {session.state}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Coach:</span>
                        <span>{session.coachName}</span>
                      </div>
                    </div>
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

export default PlayerDashboard;
