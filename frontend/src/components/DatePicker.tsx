import React from "react";

type Props = {
  id?: string;
  label?: string;
  name?: string;
  value?: string; // YYYY-MM-DD
  defaultValue?: string; // YYYY-MM-DD
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
};

export default function DatePicker({
  id,
  label,
  name,
  value,
  defaultValue,
  min,
  max,
  required,
  disabled,
  onChange,
  className,
}: Props) {
  const inputId =
    id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} style={{ display: "block", marginBottom: 4 }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type="date"
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #cbd5e1",
          background: disabled ? "#f8fafc" : "white",
        }}
      />
    </div>
  );
}
