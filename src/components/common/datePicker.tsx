"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  onChange?: (date: Date | undefined) => void;
  label?: string;
  labelClassName?: string;
}

export function DatePicker({
  onChange,
  label,
  labelClassName,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="w-full px-0.5">
      {label && (
        <label
          className={cn(
            "mb-1 block text-sm font-medium text-gray-700",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow]",
              "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              !date ? "text-muted-foreground" : "text-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(val) => {
              setDate(val);
              onChange?.(val);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
