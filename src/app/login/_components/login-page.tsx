"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomInputV1 from "@/components/CustomInputV1";
import { Button } from "@/components/ui/button";
import { themeColors, colors } from "@/lib/constant/colors";
import { Loader2 } from "lucide-react";
import logo from "@/assets/imgs/logo.png";
import { useAppDispatch } from "@/lib/hook/redux-hook";
import { loginUserPassword } from "@/lib/store/reducer/auth";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone.trim());

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = { phone: "", password: "" };

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleLogin = async () => {
    if (!validateForm() || loading) return;

    try {
      setLoading(true);
      const payload = {
        mobile: formData.phone.trim(),
        password: formData.password,
      };
      const response = await dispatch(loginUserPassword(payload)).unwrap();
      console.log(response, "----response");
      if (response.success) {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: themeColors.surface.background }}
    >
      {/* Logo */}
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

      {/* Form */}
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
          className="w-full mt-6 cursor-pointer"
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

        {/* Register link */}
        <div className="flex justify-center mt-6">
          <p className="text-sm" style={{ color: themeColors.text.secondary }}>
            Don&apos;t have an account?
          </p>
          <button
            onClick={() => router.push("/register")}
            className="ml-1 font-bold text-sm cursor-pointer"
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
