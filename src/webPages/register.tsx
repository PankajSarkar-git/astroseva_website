"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { colors, themeColors } from "@/constant/colors";
import { useRouter } from "next/navigation";
import logo from "@/assets/imgs/logo.png";
type FormData = {
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>();

  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validatePassword = (password: string) => password.length >= 8;

  const onSubmit = async (data: FormData) => {
    if (!validatePhone(data.phone)) {
      setError("phone", {
        message: "Please enter a valid 10-digit phone number",
      });
      return;
    }
    if (!validatePassword(data.password)) {
      setError("password", {
        message: "Password must be at least 8 characters long",
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      // API call here
      // const res = await registerUserAPI(data);
      console.log("Register payload:", data);
      router.push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full flex-col max-w-md min-h-screen justify-between bg-white">
        {/* Logo */}
        <div className="flex justify-center mt-10">
          <Image src={logo} alt="Logo" width={200} height={200} priority />
        </div>

        {/* Form */}
        <div className="px-10 py-5">
          <h1 className="text-3xl font-bold mb-1">Register</h1>
          <p className="text-base mb-6">Create your Astrosevaa account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register("fullName", { required: "Full name is required" })}
                onChange={() => clearErrors("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">+91</span>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  maxLength={10}
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  onChange={() => clearErrors("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
                onChange={() => clearErrors("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                onChange={() => clearErrors("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full"
              style={{
                backgroundColor: themeColors.button.primary,
                color: themeColors.text.light,
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Already have an account?
              </span>{" "}
              <button
                type="button"
                className="text-sm font-bold"
                style={{ color: themeColors.text.primary }}
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Terms */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className="text-sm"
            style={{ color: colors.primaryText }}
          >
            Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
}
