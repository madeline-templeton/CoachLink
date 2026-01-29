import React from "react";
import { STATES, CITIES_BY_STATE } from "../services/locations";

export type LocationValue = {
  state: string;
  city: string;
};

type Props = {
  label?: string;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  placeholderState?: string;
  placeholderCity?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export default function LocationSelector({
  label = "Location",
  value,
  onChange,
  placeholderState = "Select state",
  placeholderCity = "Select city",
  disabled,
  required,
  className,
}: Props) {
  const cities = value.state ? (CITIES_BY_STATE[value.state] ?? []) : [];
  const handleStateChange = (state: string) => {
    onChange({ state, city: "" });
  };
  const handleCityChange = (city: string) => {
    onChange({ state: value.state, city });
  };

  return (
    <div className={className}>
      {label && (
        <div style={{ marginBottom: 6, fontWeight: 400, textAlign: "center" }}>
          {label}
        </div>
      )}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select
          aria-label="State"
          value={value.state}
          onChange={(e) => handleStateChange(e.target.value)}
          disabled={disabled}
          required={required}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            flex: 1,
            minWidth: 100,
          }}
        >
          <option value="" disabled>
            {placeholderState}
          </option>
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          aria-label="City"
          value={value.city}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={disabled || !value.state}
          required={required}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            flex: 1,
            minWidth: 100,
          }}
        >
          <option value="" disabled>
            {placeholderCity}
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
