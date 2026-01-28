import React from "react";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type Props = {
  id?: string;
  label?: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  className?: string;
};

export function Dropdown({
  id,
  label,
  options,
  value,
  defaultValue,
  placeholder,
  disabled,
  name,
  required,
  onChange,
  className,
}: Props) {
  const selectId =
    id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} style={{ display: "block", marginBottom: 4 }}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #cbd5e1",
          minWidth: 220,
          background: disabled ? "#f8fafc" : "white",
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
