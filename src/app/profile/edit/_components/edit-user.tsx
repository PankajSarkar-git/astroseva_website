"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { postUserDetail, uploadProfileImage } from "@/lib/store/reducer/user";
import { setUser } from "@/lib/store/reducer/auth";
import { Loader2, Edit3, Calendar } from "lucide-react";
import DateOfBirthPicker from "@/app/kundli/_components/kundliForm/DateOfBirthPicker";
import { showToast } from "@/components/common/toast";

type UserPersonalDetail = {
  name?: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  latitude?: number;
  longitude?: number;
};

const genderTags = [
  { id: "MALE", label: "Male" },
  { id: "FEMALE", label: "Female" },
  { id: "OTHER", label: "Other" },
];

export default function UserProfileEditPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s: any) => s.auth);

  const now = new Date();
  const initialBirthDate = user?.birthDate ?? ""; // expected ISO yyyy-mm-dd
  const initialBirthTime =
    user?.birthTime ?? now.toTimeString().split(" ")[0].slice(0, 5); // HH:MM

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(
    user?.imgUri ??
      (user?.gender === "MALE" || !user?.gender
        ? "/imgs/male.jpg"
        : "/imgs/female.jpg")
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [personalDetail, setPersonalDetail] = useState<UserPersonalDetail>({
    name: user?.name ?? "",
    gender: user?.gender ?? "",
    birthDate: initialBirthDate,
    birthTime: initialBirthTime,
    birthPlace: user?.birthPlace ?? "",
    latitude: typeof user?.latitude === "number" ? user.latitude : 22.5744,
    longitude: typeof user?.longitude === "number" ? user.longitude : 88.3629,
  });

  // keep local date / time state if needed for native pickers (not required but convenient)
  const [dateValue, setDateValue] = useState(personalDetail.birthDate || "");
  const [timeValue, setTimeValue] = useState(
    personalDetail.birthTime || initialBirthTime
  );

  useEffect(() => {
    // keep sync
    setPersonalDetail((p) => ({ ...p, birthDate: dateValue }));
  }, [dateValue]);

  useEffect(() => {
    setPersonalDetail((p) => ({ ...p, birthTime: timeValue }));
  }, [timeValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    // Immediately upload (like RN flow)
    await handleCaptureImage(file);
  };

  const handleCaptureImage = async (file: File) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file, file.name);

      const payload: any = await dispatch(
        uploadProfileImage(formData)
      ).unwrap();

      if (payload?.success) {
        toast.success("Profile image changed");
        // Optionally update user in store if API returns updated user
        if (payload.user) dispatch(setUser(payload.user));
      } else {
        toast.error("Upload profile image failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload profile image failed. Please try again later.");
    }
  };

  const handleChange = (key: keyof UserPersonalDetail, value: any) => {
    setPersonalDetail((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];
    if (!personalDetail.name || personalDetail.name.trim() === "") {
      validationErrors.push("Please enter your name.");
    }
    if (!personalDetail.gender || personalDetail.gender.trim() === "") {
      validationErrors.push("Please select your gender.");
    }
    if (!personalDetail.birthPlace || personalDetail.birthPlace.trim() === "") {
      validationErrors.push("Please select your place of birth.");
    }
    if (!personalDetail.birthTime || personalDetail.birthTime.trim() === "") {
      validationErrors.push("Please select your birth time.");
    }
    if (!personalDetail.birthDate || personalDetail.birthDate.trim() === "") {
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
    if (
      typeof personalDetail.latitude !== "number" ||
      typeof personalDetail.longitude !== "number"
    ) {
      validationErrors.push("Invalid birth place coordinates.");
    }
    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error(validationErrors[0]);
      return;
    }

    setErrors([]);
    setIsSaving(true);

    const payloadBody = {
      ...personalDetail,
      name: personalDetail.name ?? "",
      gender: personalDetail.gender?.toUpperCase() ?? "",
      birthDate: personalDetail.birthDate ?? "",
      birthTime: personalDetail.birthTime ?? "",
      birthPlace: personalDetail.birthPlace ?? "",
      latitude:
        typeof personalDetail.latitude === "number"
          ? personalDetail.latitude
          : 22.5744,
      longitude:
        typeof personalDetail.longitude === "number"
          ? personalDetail.longitude
          : 88.3629,
    };

    try {
      const payload: any = await dispatch(postUserDetail(payloadBody)).unwrap();
      if (payload?.success) {
        if (payload.user) dispatch(setUser(payload.user));
        showToast.success("Profile updated");
        // navigate back to profile screen / page
        router.push("/profile");
      } else {
        showToast.error("Error while saving user data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while saving user data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent>
          {/* Profile image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={profileImagePreview}
                alt="Profile"
                fill
                className="rounded-xl object-cover border"
                sizes="96px"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-white border rounded-full p-1 cursor-pointer shadow"
                title="Change profile image"
              >
                <Edit3 size={16} />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              className="h-10 rounded-lg"
              value={personalDetail.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Name"
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <DateOfBirthPicker
                value={dateValue}
                onChange={(newDate) => setDateValue(newDate)}
                placeholder="Select your date of birth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Time
              </label>
              <input
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="w-full border px-3 h-10  rounded-lg"
              />
            </div>

            {/* Gender selector (single select) */}
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-2">
                {genderTags.map((g) => {
                  const active =
                    (personalDetail.gender ?? "").toUpperCase() === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleChange("gender", g.id)}
                      className={`px-3 py-2 cursor-pointer rounded-md border ${
                        active
                          ? "bg-button-primary text-white border-button-secondary"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Birth place (simple input fallback for web) */}
            <Input
              className="h-10 rounded-lg"
              value={personalDetail.birthPlace || ""}
              onChange={(e) => handleChange("birthPlace", e.target.value)}
              placeholder="Birth Place"
            />

            {/* coordinates are kept same as RN default unless your location picker sets them */}
            {/* <div className="flex gap-2">
              <Input
                className="h-10 rounded-lg"
                value={(personalDetail.latitude ?? 22.5744).toString()}
                onChange={(e) =>
                  handleChange("latitude", parseFloat(e.target.value) || 0)
                }
                placeholder="Latitude"
              />
              <Input
                className="h-10 rounded-lg"
                value={(personalDetail.longitude ?? 88.3629).toString()}
                onChange={(e) =>
                  handleChange("longitude", parseFloat(e.target.value) || 0)
                }
                placeholder="Longitude"
              />
            </div> */}

            <div className="mt-4">
              <Button
                className="w-full bg-button-primary hover:bg-button-secondary"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Updating.." : "Save"}
              </Button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-4 text-red-600">
                <p className="font-semibold">
                  Please fix the following errors:
                </p>
                <ul className="list-disc ml-5 space-y-1 mt-2">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
