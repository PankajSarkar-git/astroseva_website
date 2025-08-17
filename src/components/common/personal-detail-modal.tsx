import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./datePicker";
import TimeInput from "./time-input";
import TagSelector from "./tag";

import { UserPersonalDetail } from "@/lib/utils/types";
import CustomModal from "./modal";

interface PersonalDetailModalProps {
  parent: string;
  isSaving?: boolean;
  isOpen: boolean;
  onClose: () => void;
  existingDetails?: UserPersonalDetail;
  onSubmit: (details: UserPersonalDetail) => void;
  showClosebtn?: boolean;
}

const genderTags = [
  { id: "MALE", label: "Male" },
  { id: "FEMALE", label: "Female" },
  { id: "OTHER", label: "Other" },
];

const PersonalDetailModal: React.FC<PersonalDetailModalProps> = ({
  parent,
  isSaving,
  isOpen,
  onClose,
  onSubmit,
  existingDetails,
  showClosebtn,
}) => {
  const now = new Date();

  const [date, setDate] = useState<Date>(now);
  const [time, setTime] = useState<Date>(now);
  const [personalDetail, setPersonalDetail] = useState<UserPersonalDetail>({
    name: "",
    gender: "",
    birthDate: now.toISOString().split("T")[0],
    birthTime: now.toTimeString().split(" ")[0],
    birthPlace: "",
    latitude: 22.5744,
    longitude: 88.3629,
  });

  useEffect(() => {
    if (isOpen && existingDetails) {
      const { name, gender, birthDate, birthTime, birthPlace } =
        existingDetails;

      const parsedDate = new Date(birthDate);
      const parsedTime = new Date(`1970-01-01T${birthTime}`);

      setDate(parsedDate);
      setTime(parsedTime);

      setPersonalDetail((prev) => ({
        ...prev,
        name,
        gender: gender?.toUpperCase(),
        birthDate,
        birthTime,
        birthPlace,
      }));
    }
  }, [isOpen, existingDetails]);

  const handleChange = (key: keyof UserPersonalDetail, value: any) => {
    setPersonalDetail((prev) => ({ ...prev, [key]: value }));
  };

  const footer = (
    <Button
      onClick={() => {
        onSubmit({
          ...personalDetail,
          gender: personalDetail.gender?.toUpperCase(),
        });
      }}
      disabled={isSaving}
    >
      {isSaving ? "Saving..." : "Submit"}
    </Button>
  );

  return (
    <CustomModal
      visible={isOpen}
      onClose={onClose}
      parent={parent}
      footer={footer}
      header={{
        title: "Personal Details",
        description: "Please enter your details",
      }}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={personalDetail.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Date of Birth */}
        <DatePicker
          label="Date of Birth"
          onChange={(newDate: Date | undefined) => {
            if (!newDate) return;
            setDate(newDate);
            handleChange("birthDate", newDate.toISOString().split("T")[0]);
          }}
        />

        {/* Time of Birth */}
        <TimeInput
          label="Time of Birth"
          value={time}
          onChange={(newTime) => {
            if (!newTime) return;
            setTime(newTime);
            handleChange("birthTime", newTime.toTimeString().split(" ")[0]);
          }}
        />

        {/* Gender Selector */}
        <TagSelector
          label="Gender"
          tags={genderTags}
          selectedTags={personalDetail.gender ? [personalDetail.gender] : []}
          onChange={(selected) => {
            handleChange("gender", selected[0] || "");
          }}
          multiSelect={false}
        />

        {/* Place of Birth */}
        <div>
          <Label htmlFor="birthPlace">Place of Birth</Label>
          <Input
            id="birthPlace"
            placeholder="Enter your birth place"
            value={personalDetail.birthPlace}
            onChange={(e) =>
              setPersonalDetail((prev) => ({
                ...prev,
                birthPlace: e.target.value,
                latitude: 22.5744,
                longitude: 88.3629,
              }))
            }
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default PersonalDetailModal;
