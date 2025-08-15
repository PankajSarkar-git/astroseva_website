"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomInputV1 from "@/components/CustomInputV1";
import { Button } from "@/components/ui/button";
import { colors, themeColors } from "@/constant/colors";
import logo from "@/assets/imgs/logo.png";
import { useAppDispatch } from "@/hook/redux-hook";
import { registerUser } from "@/store/reducer/auth/action";

type FormData = {
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormData>({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validatePassword = (password: string) => password.length >= 8;

  const validateForm = () => {
    const newErrors: FormData = {
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = await dispatch(
        registerUser({
          name: formData.fullName.trim(),
          mobile: formData.phone,
          password: formData.password,
        })
      ).unwrap();

      if (payload.success) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Register Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-white px-10 py-8">
      {/* Logo */}
      <div className="flex justify-center mt-10">
        <Image src={logo} alt="Logo" width={80} height={80} priority />
      </div>

      {/* Form */}
      <div className="max-w-md space-y-2 mx-auto w-full">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-base text-gray-600 mb-8">
          Create your Astrosevaa account
        </p>

        <CustomInputV1
          showError={!!errors.fullName}
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          errorMessage={errors.fullName}
        />

        <CustomInputV1
          showError={!!errors.phone}
          preText="+91"
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          errorMessage={errors.phone}
          maxLength={10}
        />

        <CustomInputV1
          showError={!!errors.password}
          label="Password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          errorMessage={errors.password}
        />

        <CustomInputV1
          showError={!!errors.confirmPassword}
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) =>
            handleInputChange("confirmPassword", e.target.value)
          }
          errorMessage={errors.confirmPassword}
        />

        <Button
          onClick={handleRegister}
          className="w-full mt-8 cursor-pointer"
          style={{
            backgroundColor: themeColors.button.primary,
            color: themeColors.text.light,
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">
            Already have an account?
          </span>{" "}
          <button
            type="button"
            className="text-sm font-bold cursor-pointer"
            style={{ color: themeColors.text.primary }}
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>

      {/* Terms */}
      <div className="flex justify-center mt-10">
        <button
          type="button"
          className="text-sm cursor-pointer"
          style={{ color: colors.primaryText }}
        >
          Terms & Conditions
        </button>
      </div>
    </div>
  );
}
