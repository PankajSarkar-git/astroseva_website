"use client";

import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "../lib/utils/utils";
import { Search } from "lucide-react";

interface AnimatedSearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconPosition?: "left" | "right";
  focusedBorderColor?: string;
  unfocusedBorderColor?: string;
  focusedBorderWidth?: number;
  unfocusedBorderWidth?: number;
  focusedShadowOpacity?: number;
  enableShadow?: boolean;
  shadowColor?: string;
}

export function AnimatedSearchInput({
  placeholder = "Search...",
  value,
  onChange,
  onFocus,
  onBlur,
  iconPosition = "left",
  focusedBorderColor = "#007AFF",
  unfocusedBorderColor = "#E0E0E0",
  focusedBorderWidth = 2,
  unfocusedBorderWidth = 1,
  focusedShadowOpacity = 0.2,
  enableShadow = false,
  shadowColor,
  className,
  ...props
}: AnimatedSearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const controls = useAnimation();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    controls.start({
      borderColor: focusedBorderColor,
      borderWidth: focusedBorderWidth,
      boxShadow: enableShadow
        ? `0 0 10px rgba(${hexToRgb(
            shadowColor || focusedBorderColor
          )}, ${focusedShadowOpacity})`
        : "none",
      transition: { duration: 0.2 },
    });
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    controls.start({
      borderColor: unfocusedBorderColor,
      borderWidth: unfocusedBorderWidth,
      boxShadow: "none",
      transition: { duration: 0.2 },
    });
    onBlur?.(e);
  };

  React.useEffect(() => {
    controls.start({
      borderColor: unfocusedBorderColor,
      borderWidth: unfocusedBorderWidth,
      boxShadow: "none",
    });
  }, []);

  return (
    <motion.div
      animate={controls}
      className={cn(
        "flex items-center rounded-full px-4 py-2 bg-white",
        className
      )}
    >
      {iconPosition === "left" && (
        <Search className="w-5 h-5 text-gray-500 mr-2" />
      )}
      <Input
        className={cn(
          "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1",
          iconPosition === "left" ? "pl-0" : "pr-0"
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {iconPosition === "right" && (
        <Search className="w-5 h-5 text-gray-500 ml-2" />
      )}
    </motion.div>
  );
}

// Helper to convert hex to rgb for box-shadow
function hexToRgb(hex: string) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}
