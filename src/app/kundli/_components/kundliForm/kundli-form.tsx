import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import ModalWrapper from "./ModalWrapper";
import FormHeader from "./FormHeader";
import ErrorAlert from "./ErrorAlert";
import FormField from "./FormField";
import DateOfBirthPicker from "./DateOfBirthPicker";
import CoordinatesDisplay from "./CoordinatesDisplay";
import LoadingButton from "./LoadingButton";
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

interface KundliFormProps {
  onSubmitSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const KundliForm: React.FC<KundliFormProps> = ({
  onSubmitSuccess,
  isOpen = true,
  onClose = () => {},
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const [personalDetail, setPersonalDetail] = useState<UserPersonalDetail>({
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "12:00",
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

      // Simulate API call
      dispatch(setKundliPerson(formattedDetails));
      console.log("Form submitted:", formattedDetails);

      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Kundli"
      className="max-w-lg"
    >
      <Card className="shadow-none border-0 bg-white/95 backdrop-blur-sm">
        <FormHeader
          title="Create Your Kundli"
          description="Enter your birth details for accurate astrological predictions"
        />

        <CardContent className="space-y-6">
          <ErrorAlert errors={errors} />

          <FormField
            id="name"
            label="Full Name"
            value={personalDetail.name}
            onChange={(value) => handleChange({ key: "name", value })}
            placeholder="Enter your full name"
            icon={<User className="h-4 w-4" />}
            required
          />

          <FormField
            id="gender"
            label="Gender"
            type="select"
            value={personalDetail.gender}
            onChange={(value) => handleChange({ key: "gender", value })}
            placeholder="Select your gender"
            options={genderOptions}
            required
          />

          <FormField
            id="birthDate"
            label="Date of Birth"
            type="custom"
            value={personalDetail.birthDate}
            onChange={(value) => handleChange({ key: "birthDate", value })}
            icon={<Calendar className="h-4 w-4" />}
            required
            
          >
            <DateOfBirthPicker
              value={personalDetail.birthDate}
              onChange={(date) =>
                handleChange({ key: "birthDate", value: date })
              }
            />
          </FormField>

          <FormField
            id="birthTime"
            label="Time of Birth"
            type="time"
            value={personalDetail.birthTime}
            onChange={(value) => handleChange({ key: "birthTime", value })}
            icon={<Clock className="h-4 w-4 " />}
            required
          />

          <FormField
            id="birthPlace"
            label="Place of Birth"
            value={personalDetail.birthPlace}
            onChange={(value) => handleChange({ key: "birthPlace", value })}
            placeholder="Enter your birth city"
            icon={<MapPin className="h-4 w-4" />}
            required
          />

          {/* <CoordinatesDisplay
            latitude={personalDetail.latitude}
            longitude={personalDetail.longitude}
          /> */}

          <LoadingButton
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating Kundli..."
            className="w-full bg-button-primary hover:bg-button-secondary text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-2">
              <span>Generate Kundli</span>
            </div>
          </LoadingButton>
        </CardContent>
      </Card>
    </ModalWrapper>
  );
};

export default KundliForm;
