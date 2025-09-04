"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomInputV1 from "@/components/CustomInputV1";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/hook/redux-hook";
import { loginUserPassword } from "@/lib/store/reducer/auth/action";
import { showToast } from "@/components/common/toast";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    console.log('login..................');

    try {
      setLoading(true);
      const mobile = formData.phone.trim();

      const payload = {mobile, password: formData.password};
      const response = await dispatch(loginUserPassword(payload)).unwrap();
      console.log('Login response:', response);
      if (response.success) {
        router.push('/')
        showToast.success("Login successful")
      }
    } catch (err: any) {
      // Toast.show({type: 'error', text1: err?.message || 'Login failed'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-6 py-10">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="logo"
        width={100}
        height={100}
        className="mt-10"
      />

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mt-6 text-center">
        Welcome Back
      </h1>

      {/* Phone input */}
      <CustomInputV1
        preText="+91"
        label="Phone Number"
        placeholder="Enter phone number"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        maxLength={10}
        type="tel"
        showError={!!errors.phone}
        errorMessage={errors.phone}
        containerClassName="mt-14 w-full max-w-md"
      />

      {/* Password input */}
      <CustomInputV1
        label="Password"
        placeholder="Enter password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        secureToggle
        type="password"
        showError={!!errors.password}
        errorMessage={errors.password}
        containerClassName="mt-6 w-full max-w-md"
      />

      {/* Login button */}
      <Button
        onClick={handleLogin}
        disabled={loading}
        className="cursor-pointer mt-6 w-full max-w-md bg-button-primary hover:bg-button-secondary text-white text-lg py-6 rounded-2xl"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
      </Button>

      {/* Footer links */}
      <div className="flex gap-2 mt-6 text-sm text-gray-600">
        <span>Don&apos;t have an account?</span>
        <button
          onClick={() => router.push("/register")}
          className="font-semibold text-gray-800 hover:underline"
        >
          Register
        </button>
      </div>

      <div className="flex gap-2 mt-4 text-sm text-gray-600">
        <span>Forgot Password?</span>
        <button
          onClick={() => router.push("/support")}
          className="font-semibold text-gray-800 hover:underline"
        >
          Need Help
        </button>
      </div>
    </div>
  );
}
