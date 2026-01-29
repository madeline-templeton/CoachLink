import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { signInWithGoogle, signOut } from "../services/auth";
import Button from "./Button";

export function AuthButton() {
  const { user, userProfile } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      alert(`Sign in failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      alert(`Sign out failed: ${error.message}`);
    }
  };

  if (user) {
    return (
      <div className="auth-section">
        <span className="user-info">
          {userProfile?.role === "coach" && "🎓 "}
          {userProfile?.role === "player" && "⚽ "}
          {user.displayName || user.email}
        </span>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="auth-section">
      <Button onClick={handleSignIn}>Sign In with Google</Button>
    </div>
  );
}

export default AuthButton;
