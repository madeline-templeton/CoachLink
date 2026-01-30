import React from "react";
import Button from "./Button";
import type { Session } from "../types/Session";

type Props = {
  session: Session;
  onBook: () => void;
  isBooked?: boolean;
};

export function SessionCard({ session, onBook, isBooked }: Props) {
  // Format time to display
  const time = session.time || "TBD";

  return (
    <div className="session-card">
      <div className="session-card-left">
        <div className="session-field">
          <div className="session-field-label">SPORT</div>
          <div className="session-field-value">{session.sport || "TBD"}</div>
        </div>

        <div className="session-field">
          <div className="session-field-label">LOCATION</div>
          <div className="session-field-value">
            {session.city}, {session.state}
          </div>
        </div>

        <div className="session-field">
          <div className="session-field-label">Date</div>
          <div className="session-field-value">{session.date}</div>
        </div>
      </div>

      <div className="session-card-middle">
        <div className="session-field">
          <div className="session-field-label">Time</div>
          <div className="session-field-value">{time}</div>
        </div>

        <div className="session-field">
          <div className="session-field-label">Duration</div>
          <div className="session-field-value">
            {session.duration ? `${session.duration} min` : "TBD"}
          </div>
        </div>

        <div className="session-field session-field-cost">
          <div className="session-field-label">Cost</div>
          <div className="session-field-value">
            {session.cost ? `$${session.cost}` : "TBD"}
          </div>
        </div>
      </div>

      <div className="session-card-right">
        <div className="coach-info">
          <div className="coach-name">Coach: {session.coachName || "TBD"}</div>
          <div className="coach-note">
            {session.coachExperience || "coachNote"}
          </div>
        </div>

        {!isBooked ? (
          <Button
            variant="success"
            onClick={onBook}
            className="book-now-button"
          >
            BOOK NOW!
          </Button>
        ) : (
          <div className="booked-badge-large">BOOKED</div>
        )}
      </div>
    </div>
  );
}

export default SessionCard;
