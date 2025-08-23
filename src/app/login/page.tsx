"use client";
import { useEffect, useState } from "react";
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
import { Eye, EyeOff, Phone, Lock, Loader2, Star } from "lucide-react";
import { loginUserPassword } from "@/lib/store/reducer/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hook/redux-hook";
import logo from "@/assets/imgs/logo.png";
import Image from "next/image";
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        console.log(response, "---login response");
        // WebSocket.init(userId, websocketUrl)
        //   .connect()
        //   .then(() => console.log("Connected to WebSocket!"))
        //   .catch((err) => console.error("WebSocket connection failed:", err));
        router.push("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace("/home");
  //   }
  // }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center">
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Astrosevaa</h1>
            <p className="text-sm text-gray-500 mt-1">
              Connect with the cosmos
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to continue your cosmic journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute z-10 left-3 mt-1 top-3 h-4 w-4 text-gray-400" />
                <div className="absolute z-10 left-10 top-3.5 text-sm text-gray-500 font-medium">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  maxLength={10}
                  className={`pl-20 h-12 transition-all duration-200 ${
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
                <Lock className="absolute left-3 z-10 mt-1 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 pr-12 h-12 transition-all duration-200 ${
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <button className="text-sm text-button-primary hover:text-button-secondary cursor-pointer transition-colors font-medium">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 mt-6 bg-button-primary hover:bg-button-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex-col space-y-4 pt-2">
            {/* Register Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
              </span>
              <button
                className="text-sm cursor-pointer font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                onClick={() => router.push("/register")}
              >
                Create Account
              </button>
            </div>

            {/* Divider */}
            {/* <div className="flex items-center space-x-4 w-full">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div> */}

            {/* Quick Login Options */}
            {/* <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="outline"
                className="h-10 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200"
                onClick={() => console.log("Guest login")}
              >
                <span className="text-sm">Guest Login</span>
              </Button>
              <Button
                variant="outline"
                className="h-10 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                onClick={() => console.log("Demo login")}
              >
                <span className="text-sm">Demo Login</span>
              </Button>
            </div> */}
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
