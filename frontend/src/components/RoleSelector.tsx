import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createUserProfile, UserRole } from "../services/auth";
import Button from "./Button";

export function RoleSelector() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user || userProfile) {
    return null;
  }

  const handleRoleSelect = async () => {
    if (!selectedRole || !user) return;

    setSaving(true);
    try {
      await createUserProfile(
        user.uid,
        user.email || "",
        user.displayName || "",
        selectedRole,
      );
      await refreshProfile();
    } catch (error: any) {
      alert(`Failed to set role: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="role-selector-overlay">
      <div className="role-selector-modal">
        <h2>Welcome to CoachLink!</h2>
        <p>Please select your role to continue:</p>

        <div className="role-options">
          <button
            className={`role-option ${selectedRole === "player" ? "selected" : ""}`}
            onClick={() => setSelectedRole("player")}
          >
            <div className="role-icon">⚽</div>
            <div className="role-title">I'm a Player</div>
            <div className="role-description">
              Find and book training sessions with coaches
            </div>
          </button>

          <button
            className={`role-option ${selectedRole === "coach" ? "selected" : ""}`}
            onClick={() => setSelectedRole("coach")}
          >
            <div className="role-icon">🎓</div>
            <div className="role-title">I'm a Coach</div>
            <div className="role-description">
              Create sessions and manage bookings
            </div>
          </button>
        </div>

        <Button
          onClick={handleRoleSelect}
          disabled={!selectedRole}
          loading={saving}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default RoleSelector;
