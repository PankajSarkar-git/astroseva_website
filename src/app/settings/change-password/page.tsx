"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { passwordReset } from "@/lib/store/reducer/settings";
import { useAppDispatch } from "@/lib/hook/redux-hook";
import { showToast } from "@/components/common/toast";

type FormFields = "currentPassword" | "newPassword" | "confirmPassword";
type PasswordField = "current" | "new" | "confirm";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Validation functions
  const validateCurrentPassword = (password: string) =>
    !password.trim() ? "Current password is required" : "";

  const validateNewPassword = (password: string) => {
    if (!password.trim()) return "New password is required";
    if (password.length < 8) return "Must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Must contain lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Must contain uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Must contain a number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Must contain special character";
    return "";
  };

  const validateConfirmPassword = (confirmPass: string, newPass: string) => {
    if (!confirmPass.trim()) return "Please confirm new password";
    if (confirmPass !== newPass) return "Passwords do not match";
    return "";
  };

  const validateForm = () => {
    const newErrors: Errors = {
      currentPassword: validateCurrentPassword(formData.currentPassword),
      newPassword: validateNewPassword(formData.newPassword),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.newPassword
      ),
    };

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword = "New password must differ from current password";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleInputChange = (field: FormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const togglePasswordVisibility = (field: PasswordField) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = await dispatch(passwordReset(formData)).unwrap();
      if (payload.success) {
        showToast.success("Password changed successfully");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      showToast.error("Failed to change password. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordInput = (
    label: string,
    field: FormFields,
    placeholder: string,
    showPasswordField: PasswordField
  ) => (
    <div className="mb-6">
      <Label className="mb-1">{label}</Label>
      <div className="relative">
        <Input
          type={showPasswords[showPasswordField] ? "text" : "password"}
          placeholder={placeholder}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={errors[field] ? "border-red-500" : ""}
        />
        <span
          onClick={() => togglePasswordVisibility(showPasswordField)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
        >
          {showPasswords[showPasswordField] ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
      {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-2">Change Password</h1>
      <p className="text-gray-600 mb-8">
        Please enter your current password and choose a new secure password.
      </p>

      <Card className="p-6 space-y-6 shadow">
        {renderPasswordInput(
          "Current Password",
          "currentPassword",
          "Enter current password",
          "current"
        )}
        {renderPasswordInput(
          "New Password",
          "newPassword",
          "Enter new password",
          "new"
        )}
        {renderPasswordInput(
          "Confirm New Password",
          "confirmPassword",
          "Confirm new password",
          "confirm"
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
          <p className="font-semibold mb-1">Password Requirements:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>At least 8 characters</li>
            <li>One uppercase letter (A-Z)</li>
            <li>One lowercase letter (a-z)</li>
            <li>One number (0-9)</li>
            <li>One special character (@$!%*?&)</li>
          </ul>
        </div>

        <Button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="w-full bg-button-primary hover:bg-button-secondary flex items-center justify-center space-x-2"
        >
          {isLoading && <span className="loader-border"></span>}
          <span>{isLoading ? "Changing Password..." : "Change Password"}</span>
        </Button>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
