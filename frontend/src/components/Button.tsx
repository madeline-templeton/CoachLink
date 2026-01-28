import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled,
  loading,
  className,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 8,
        border: "1px solid transparent",
        background: disabled || loading ? "#94a3b8" : "#2563eb",
        color: "white",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontWeight: 600,
      }}
    >
      {loading && (
        <span
          aria-hidden
          style={{
            width: 14,
            height: 14,
            border: "2px solid rgba(255,255,255,0.6)",
            borderTopColor: "white",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.9s linear infinite",
          }}
        />
      )}
      <span>{children}</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
