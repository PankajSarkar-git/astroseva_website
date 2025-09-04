"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomInputV1 from "@/components/CustomInputV1";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { showToast } from "@/components/common/toast";
import { registerUser } from "@/lib/store/reducer/auth/action";
import { useAppDispatch } from "@/lib/hook/redux-hook";

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
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      console.log("calling this api");
      setLoading(true);
      const payload = await dispatch(
        registerUser({
          name: formData.fullName.trim(),
          mobile: formData.phone,
          password: formData.password,
        })
      ).unwrap();

      if (payload.success) {
        showToast.success("Registration Successful");
        router.push("/");
      }
    } catch (err: any) {
      console.log(err, "<<<< REGISTER ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Logo */}
      <div className="flex justify-center mt-10">
        <Image src="/logo.png" alt="Logo" width={54} height={60} />
      </div>

      {/* Form */}
      <div className="px-10 py-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800">Register</h1>
        <p className="text-gray-600 mt-1">Create your Astrosevaa account</p>

        {/* Full Name */}
        <CustomInputV1
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          errorMessage={errors.fullName}
          showError={!!errors.fullName}
          containerClassName="mt-10 w-full max-w-md"
        />

        {/* Phone */}
        <CustomInputV1
          label="Phone Number"
          placeholder="Enter your phone number"
          preText="+91"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          errorMessage={errors.phone}
          showError={!!errors.phone}
          maxLength={10}
          type="tel"
          containerClassName="mt-6 w-full max-w-md"
        />

        {/* Password */}
        <CustomInputV1
          label="Password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          errorMessage={errors.password}
          showError={!!errors.password}
          secureToggle
          type="password"
          containerClassName="mt-6 w-full max-w-md"
        />

        {/* Confirm Password */}
        <CustomInputV1
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          errorMessage={errors.confirmPassword}
          showError={!!errors.confirmPassword}
          secureToggle
          type="password"
          containerClassName="mt-6 w-full max-w-md"
        />

        {/* Register Button */}
        <Button
          onClick={handleRegister}
          disabled={loading}
          className="mt-8 w-full max-w-md bg-button-primary hover:bg-button-secondary text-white text-lg py-6 rounded-2xl"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
        </Button>

        {/* Already have account */}
        <button
          onClick={() => router.push("/login")}
          className="mt-4 text-gray-600 text-sm"
        >
          Already have an account?{" "}
          <span className="text-gray-900 font-semibold">Login</span>
        </button>
      </div>

      {/* Terms & Conditions */}
      <div className="flex justify-center pb-6">
        <button className="text-gray-700 text-sm hover:underline">
          Terms & Conditions
        </button>
      </div>
    </div>
  );
}
