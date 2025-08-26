"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  Sparkles,
  User,
  Wallet,
  Settings,
  LogOut,
  Menu,
  MessageCircleIcon,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { logout } from "@/lib/store/reducer/auth";
import { useUserRole } from "@/lib/hook/use-role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  walletBalance: "₹1,250",
};

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {token} = useAppSelector(store=> store.auth)

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const role = useUserRole();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
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
      href: "/chat",
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

  const profileItems = [
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

  const handleNav = (href: string) => {
    router.push(href);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <nav className="bg-white border-b shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-orange-600">Astroseva</h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4">
            {navItems
              .filter((item) => item.role.includes(role))
              .map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNav(item.href)}
                    className={`flex items-center gap-2 ${
                      active ? "text-orange-600 font-semibold" : "text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            {/* Profile Dropdown & Mobile Menu Button */}
            {token ? (<div className="flex items-center space-x-4">
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

                  {profileItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => handleNav(item.href)}
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
            </div>) : (
              <Button onClick={()=> router.push('/login') } title="login" variant={'default'} className="bg-button-primary text-white hover:bg-button-secondary "> <LogOut className="w-5 h-5 mr-3" /> Login</Button>
            )}
          </div>

          {/* Avatar & Menu (Mobile) */}
          <div className="flex items-center gap-3 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar Drawer (Mobile) */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isSidebarOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`absolute top-0 left-0 h-full w-3/4 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col p-4 space-y-2">
            {navItems
              .filter((item) => item.role.includes(role))
              .map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.href)}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-all ${
                      active
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-100 text-gray-800"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
          </div>

          {/* Profile Items */}
          <div className="border-t mt-4 p-4 space-y-2">
            {profileItems
              .filter((item) => item.role.includes(role))
              .map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.href)}
                    className="flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-800"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Logout */}
          <div className="border-t mt-4 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
