"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Phone, Lock, Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hook/redux-hook";
import { registerUser } from "@/lib/store/reducer/auth";
// import logo from "@/assets/imgs/logo.png";
// import Image from "next/image";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        router.push("/");
      }
    } catch (err) {
      console.error("Register Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand Section */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center">
            <img
              src={'../../../assets/imgs/logo.png'}
              alt="Logo"
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Astrosevaa</h1>
            <p className="text-sm text-gray-500">Connect with the cosmos</p>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join thousands discovering their cosmic journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute mt-1 z-10 left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={`pl-10 h-11 transition-all duration-200 ${
                    errors.fullName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-violet-500 focus:ring-violet-200"
                  }`}
                />
              </div>
              {errors.fullName && (
                <Alert className="py-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-red-600">
                    {errors.fullName}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 mt-1 z-10 top-3 h-4 w-4 text-gray-400" />
                <div className="absolute left-10 z-10 top-3 text-sm text-gray-500 font-medium">
                  +91
                </div>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  maxLength={10}
                  className={`pl-20 h-11 transition-all duration-200 ${
                    errors.phone
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-violet-500 focus:ring-violet-200"
                  }`}
                />
              </div>
              {errors.phone && (
                <Alert className="py-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-red-600">
                    {errors.phone}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute mt-1 z-10 left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 pr-12 h-11 transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-violet-500 focus:ring-violet-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute mt-1 z-10 right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <Alert className="py-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-red-600">
                    {errors.password}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 mt-1 z-10 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`pl-10 pr-12 h-11 transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-violet-500 focus:ring-violet-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute mt-1 z-10 right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <Alert className="py-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Register Button */}
            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-11 mt-6 bg-button-primary hover:bg-button-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex-col space-y-4 pt-2">
            {/* Login Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
              </span>
              <button
                className="text-sm font-semibold cursor-pointer  text-violet-600 hover:text-violet-700 transition-colors"
                onClick={() => router.push("/login")}
              >
                Sign in
              </button>
            </div>
          </CardFooter>
        </Card>

        {/* Terms Link */}
        <div className="text-center">
          <button className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
            Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
}
