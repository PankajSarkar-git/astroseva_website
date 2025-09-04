"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/utils";
import { Eye, EyeOff } from "lucide-react";

type CustomInputV1Props = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  preText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureToggle?: boolean;
  showError?: boolean;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const CustomInputV1: React.FC<CustomInputV1Props> = ({
  label,
  value,
  onChange,
  containerClassName,
  inputClassName,
  labelClassName,
  preText,
  leftIcon,
  rightIcon,
  secureToggle = false,
  showError = false,
  errorMessage,
  type = "text",
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [secureText, setSecureText] = useState(secureToggle);

  return (
    <div className={cn("space-y-1", containerClassName)}>
      {label && (
        <Label className={cn("text-base text-gray-700", labelClassName)}>
          {label}
        </Label>
      )}
      <div
        className={cn(
          "flex items-center border-b-2 transition-colors duration-200",
          focused ? "border-secondary" : "border-border",
          showError && "border-red-500"
        )}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {preText && (
          <span className="mr-2 text-muted-foreground">{preText}</span>
        )}
        <Input
          value={value}
          onChange={onChange}
          type={secureText ? type : "text"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "border-none focus-visible:ring-0 focus-visible:ring-offset-0",
            inputClassName
          )}
          {...rest}
        />
        {secureToggle ? (
          <button
            type="button"
            onClick={() => setSecureText((prev) => !prev)}
            className="ml-2 text-muted-foreground"
          >
            {secureText ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : (
          rightIcon && <span className="ml-2">{rightIcon}</span>
        )}
      </div>
      {showError && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomInputV1;
