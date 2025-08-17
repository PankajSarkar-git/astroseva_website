"use client";
import React from "react";

interface TimeInputProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  baseDate?: Date;
  id?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "00:00",
  disabled = false,
  baseDate = new Date(),
  id = "time-input",
}) => {
  const dateToTimeString = (date: Date | null): string => {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const timeStringToDate = (timeString: string): Date | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    onChange(timeValue ? timeStringToDate(timeValue) : null);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="time"
          value={dateToTimeString(value)}
          onChange={handleTimeChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 
            disabled:bg-neutral-50 disabled:cursor-not-allowed transition-colors
            ${disabled ? "text-neutral-400" : "text-neutral-900"}
          `}
        />

        {/* Debug info (optional) */}
        {value && (
          <div className="absolute -bottom-6 left-0 text-xs text-neutral-500">
            {value.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeInput;
