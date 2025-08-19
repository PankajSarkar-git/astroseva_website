"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, Sparkles, User } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/lib/hook/redux-hook";
import { setKundliPerson } from "@/lib/store/reducer/kundli";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface UserPersonalDetail {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
}

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export default function KundliForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const [personalDetail, setPersonalDetail] = useState<UserPersonalDetail>({
    name: "",
    gender: "",
    birthDate: now.toISOString().split("T")[0],
    birthTime: now.toTimeString().split(" ")[0],
    birthPlace: "",
    latitude: 22.5744,
    longitude: 88.3629,
  });

  const dispatch = useAppDispatch();

  const handleChange = ({ key, value }: { key: string; value: any }) => {
    setPersonalDetail((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    if (!personalDetail.name.trim()) {
      validationErrors.push("Please enter your name.");
    }
    if (!personalDetail.gender) {
      validationErrors.push("Please select your gender.");
    }
    if (!personalDetail.birthPlace.trim()) {
      validationErrors.push("Please enter your place of birth.");
    }
    if (!personalDetail.birthTime) {
      validationErrors.push("Please select your birth time.");
    }
    if (!personalDetail.birthDate.trim()) {
      validationErrors.push("Please select your date of birth.");
    } else {
      const selectedDate = new Date(personalDetail.birthDate);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate >= today) {
        validationErrors.push("Date of birth must be in the past.");
      }
    }
    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setIsSubmitting(true);

    try {
      const formattedDetails = {
        ...personalDetail,
        gender: personalDetail.gender?.toUpperCase() || "",
      };

      dispatch(setKundliPerson(formattedDetails));
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="mx-auto w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Kundli Details
        </CardTitle>
        <CardDescription className="text-gray-600">
          Fill your birth details to proceed
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-2 font-medium">
            <User className="w-4 h-4" /> Full Name
          </Label>
          <Input
            placeholder="Enter your name"
            value={personalDetail.name}
            onChange={(e) =>
              handleChange({ key: "name", value: e.target.value })
            }
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-2 font-medium">
            <CalendarIcon className="w-4 h-4" /> Date of Birth
          </Label>
          <DatePicker
            selected={date}
            onChange={(newDate) => {
              setDate(newDate);
              if (newDate) {
                handleChange({
                  key: "birthDate",
                  value: newDate.toISOString().split("T")[0],
                });
              }
            }}
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            dateFormat="dd/MM/yyyy"
            placeholderText="Pick a date"
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Time of Birth */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4" /> Time of Birth
          </Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              handleChange({ key: "birthTime", value: e.target.value });
            }}
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <Label className="font-medium">Gender</Label>
          <Select
            value={personalDetail.gender}
            onValueChange={(value) => handleChange({ key: "gender", value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Place of Birth */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-2 font-medium">
            <MapPin className="w-4 h-4" /> Place of Birth
          </Label>
          <Input
            placeholder="Enter your birth place"
            value={personalDetail.birthPlace}
            onChange={(e) =>
              handleChange({ key: "birthPlace", value: e.target.value })
            }
          />
        </div>

        {/* Coordinates */}
        {personalDetail.latitude && personalDetail.longitude && (
          <div className="flex gap-2">
            <Badge variant="secondary">
              Lat: {personalDetail.latitude.toFixed(2)}
            </Badge>
            <Badge variant="secondary">
              Lng: {personalDetail.longitude.toFixed(2)}
            </Badge>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <Button
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardContent>
    </Card>
  );
}
