"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomInputV1 from "@/components/CustomInputV1";
import { Button } from "@/components/ui/button";
import { themeColors } from "@/constant/colors";
import { colors } from "@/constant/colors";
import { Loader2 } from "lucide-react";
import logo from "@/assets/imgs/logo.png";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{ phone: string; password: string }>(
    { phone: "", password: "" }
  );
  const [errors, setErrors] = useState<{ phone: string; password: string }>({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: { phone: string; password: string } = {
      phone: "",
      password: "",
    };

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      // Replace with actual login API call
      await new Promise((res) => setTimeout(res, 1000));

      // Simulate login success
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: themeColors.surface.background }}
    >
      <div className="flex flex-col items-center mt-10">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={200}
          className="object-contain"
        />
        <h1
          className="text-2xl font-bold mt-4 text-center"
          style={{ color: themeColors.text.primary }}
        >
          Welcome Back
        </h1>
      </div>

      <div className="max-w-md mx-auto w-full px-6 mt-10">
        <CustomInputV1
          preText="+91"
          containerClassName="mt-14"
          label="Phone Number"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          maxLength={10}
          type="tel"
          showError={!!errors.phone}
          errorMessage={errors.phone}
        />

        <CustomInputV1
          label="Password"
          placeholder="Enter password"
          containerClassName="mt-4"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          secureToggle
          type="password"
          showError={!!errors.password}
          errorMessage={errors.password}
        />

        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6"
          style={{
            backgroundColor: themeColors.button.primary,
            color: colors.primaryText,
          }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        <div className="flex justify-center mt-6">
          <p className="text-sm" style={{ color: themeColors.text.secondary }}>
            Don&apos;t have an account?
          </p>
          <button
            onClick={() => router.push("/register")}
            className="ml-1 font-bold text-sm"
            style={{ color: themeColors.text.primary }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
