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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  User,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setKundliPerson } from "@/lib/store/reducer/kundli";
import { useAppDispatch } from "@/lib/hook/redux-hook";

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
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
  const dispatch = useAppDispatch();
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

      console.log("✅ Submitting:", formattedDetails);
      dispatch(setKundliPerson(formattedDetails));
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced date formatting function
  const formatSelectedDate = (selectedDate: Date | undefined): string => {
    if (!selectedDate) return "Select your birth date";

    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();

    let calculatedAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      calculatedAge--;
    }

    return `${format(
      selectedDate,
      "EEEE, MMMM do, yyyy"
    )} (Age: ${calculatedAge})`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Kundli Form
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Fill all the details to proceed
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <User className="w-4 h-4 text-indigo-600" /> Full Name
              </Label>
              <Input
                placeholder="Enter your full name"
                value={personalDetail.name}
                onChange={(e) =>
                  handleChange({ key: "name", value: e.target.value })
                }
                className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Enhanced Date of Birth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <CalendarIcon className="w-4 h-4 text-indigo-600" /> Date of
                Birth
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left h-14 px-4 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 bg-white hover:bg-gray-50"
                  >
                    <span className={date ? "text-gray-900" : "text-gray-500"}>
                      {formatSelectedDate(date)}
                    </span>
                    <div className="flex items-center gap-2">
                      {date && (
                        <Badge
                          variant="secondary"
                          className="bg-indigo-100 text-indigo-700 border-indigo-200"
                        >
                          {format(date, "dd/MM/yyyy")}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 shadow-lg border-gray-200"
                  align="start"
                >
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Select Birth Date
                    </h4>
                    <p className="text-sm text-gray-600">
                      Choose your date of birth for accurate calculations
                    </p>
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        handleChange({
                          key: "birthDate",
                          value: newDate.toISOString().split("T")[0],
                        });
                        setIsCalendarOpen(false);
                      }
                    }}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    disabled={(date) => date > new Date()}
                    className="rounded-md"
                    classNames={{
                      months: "space-y-4",
                      month: "space-y-4",
                      caption:
                        "flex justify-center pt-1 relative items-center gap-1",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button:
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell:
                        "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-indigo-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-indigo-50 hover:text-indigo-900 rounded-md transition-colors",
                      day_selected:
                        "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-600 focus:text-white",
                      day_today: "bg-gray-100 text-gray-900 font-semibold",
                      day_outside: "text-gray-400 opacity-50",
                      day_disabled:
                        "text-gray-400 opacity-50 cursor-not-allowed",
                      day_hidden: "invisible",
                    }}
                  />
                  <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const eighteenYearsAgo = new Date(
                          today.getFullYear() - 18,
                          today.getMonth(),
                          today.getDate()
                        );
                        setDate(eighteenYearsAgo);
                        handleChange({
                          key: "birthDate",
                          value: eighteenYearsAgo.toISOString().split("T")[0],
                        });
                      }}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      18 years ago
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCalendarOpen(false)}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    >
                      Close
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <Clock className="w-4 h-4 text-indigo-600" /> Time of Birth
              </Label>
              <div className="relative">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    handleChange({ key: "birthTime", value: e.target.value });
                  }}
                  className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Don't know exact time? Use 12:00 PM as default
              </p>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">Gender</Label>
              <Select
                value={personalDetail.gender}
                onValueChange={(value) =>
                  handleChange({ key: "gender", value })
                }
              >
                <SelectTrigger className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors">
                  <SelectValue placeholder="Select your gender" />
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
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <MapPin className="w-4 h-4 text-indigo-600" /> Place of Birth
              </Label>
              <Input
                placeholder="Enter city, state, country"
                value={personalDetail.birthPlace}
                onChange={(e) =>
                  handleChange({ key: "birthPlace", value: e.target.value })
                }
                className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Coordinates */}
            {personalDetail.latitude && personalDetail.longitude && (
              <div className="flex gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Badge variant="secondary" className="bg-white border-gray-300">
                  📍 Lat: {personalDetail.latitude.toFixed(4)}
                </Badge>
                <Badge variant="secondary" className="bg-white border-gray-300">
                  🌍 Lng: {personalDetail.longitude.toFixed(4)}
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
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Kundli
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
