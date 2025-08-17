"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  History,
  Sparkles,
  User,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  MessageCircleIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hook/redux-hook";
import { logout } from "@/lib/store/reducer/auth";
import { useUserRole } from "@/lib/hook/use-role";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  walletBalance: "₹1,250",
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch();
  const role = useUserRole();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/home",
      role: ["ASTROLOGER", "USER"],
    },
    {
      id: "astrologers",
      label: "Astrologers",
      icon: Users,
      href: "/astrologers",
      role: ["USER"],
    },
    {
      id: "requests",
      label: "Requests",
      icon: Users,
      href: "/requests",
      role: ["ASTROLOGER"],
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageCircleIcon,
      href: "/history",
      role: ["ASTROLOGER", "USER"],
    },
    {
      id: "remedies",
      label: "Remedies",
      icon: Sparkles,
      href: "/remedies",
      role: ["ASTROLOGER", "USER"],
    },
  ];

  const profileMenuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
      role: ["ASTROLOGER", "USER"],
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      href: "/wallet",
      badge: userData.walletBalance,
      role: ["ASTROLOGER", "USER"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      role: ["ASTROLOGER", "USER"],
    },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const handleProfileMenuClick = (href: string) => {
    router.push(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    // additional logout logic (like router.push("/login")) can go here
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-surface-primary-surface to-surface-highlight bg-clip-text text-transparent">
                <h1 className="text-2xl font-bold">Astroseva</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  if (!item.role.includes(role)) return;
                  const IconComponent = item.icon;
                  const isActive = path === item.href;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-surface-primary-surface via-surface-primary-surface/80 to-surface-highlight text-white shadow-lg scale-105"
                          : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Dropdown & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-orange-200 transition-all duration-200"
                  >
                    <Avatar className="h-10 w-10 border-2 border-orange-200">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-400 to-purple-500 text-white font-semibold">
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2 p-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={userData.avatar}
                            alt={userData.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-purple-500 text-white">
                            {userData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium leading-none">
                            {userData.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {userData.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {profileMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => handleProfileMenuClick(item.href)}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-orange-50 rounded-lg transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-3 text-gray-600" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center p-3 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = path === item.href;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
