"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import {
  logout,
  onlineStatus,
  setAstrologer,
  setOnline,
} from "@/lib/store/reducer/auth";
import { clearSession } from "@/lib/store/reducer/session";
import { useUserRole } from "@/lib/hook/use-role";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const settingsOptions = [
  { title: "Language", path: "/settings/language" },
  { title: "Change Password", path: "/settings/change-password" },
  { title: "Terms & Conditions", path: "/settings/terms" },
  { title: "Rate the App", path: "/settings" },
  { title: "Help / Contact Support", path: "/settings/support" },
  { title: "Logout", path: "Logout" },
];

const SettingPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, astrologer_detail } = useAppSelector((s) => s.auth);
  const role = useUserRole();
  const isChatOnline = useAppSelector(
    (s) => s.auth.astrologer_detail?.isChatOnline
  );
  const isAudioOnline = useAppSelector(
    (s) => s.auth.astrologer_detail?.isAudioOnline
  );
  const isVideoOnline = useAppSelector(
    (s) => s.auth.astrologer_detail?.isVideoOnline
  );
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      dispatch(clearSession());
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to logout. Try again");
    }
  };

  const handlePress = (path: string) => {
    if (path === "Logout") {
      handleLogout();
    } else {
      router.push(path);
    }
  };

  const handleToggle = async (
    type: "CHATONLINE" | "AUDIOONLINE" | "VIDEOONLINE",
    value: boolean
  ) => {
    try {
      dispatch(setOnline({ type, value }));
      const payload = await dispatch(
        onlineStatus({ onlineType: type, status: value })
      ).unwrap();

      if (payload.success) {
        const astro = payload.astrologer;
        const astrologerData = astro
          ? {
              ...astrologer_detail,
              isAudioOnline:
                astro.isAudioOnline ?? astrologer_detail?.isAudioOnline,
              isChatOnline:
                astro.isChatOnline ?? astrologer_detail?.isChatOnline,
              isVideoOnline:
                astro.isVideoOnline ?? astrologer_detail?.isVideoOnline,
            }
          : null;
        dispatch(setAstrologer(astrologerData));
        toast.success("Online Status updated!");
      } else {
        dispatch(setOnline({ type, value: !value }));
        toast.error("Try again later");
      }
    } catch {
      dispatch(setOnline({ type, value: !value }));
      toast.error("Error updating status");
    }
  };
  

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={user?.imgUri}
          alt="profile"
          width={60}
          height={60}
          className="rounded-full border border-gray-300"
        />
        <div className="flex-1 flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{user.name || "Name"}</p>
            <p className="text-sm text-gray-600">{user.mobile || "Mobile Number"}</p>
          </div>
          <Button className="bg-button-primary hover:bg-button-secondary" onClick={() => router.push("/profile")}>{t("Manage")}</Button>
        </div>
      </div>
      {/* Online Status for Astrologers */}
      {role === "ASTROLOGER" && (
        <Card className="p-4 mb-6 space-y-4">
          <p className="text-sm text-gray-500">{t("Online Status")}</p>
          <div className="flex justify-between items-center">
            <span>Chat</span>
            <Switch
              checked={isChatOnline}
              onCheckedChange={(val) => handleToggle("CHATONLINE", val)}
            />
          </div>
          <div className="flex justify-between items-center">
            <span>Voice Call</span>
            <Switch
              checked={isAudioOnline}
              onCheckedChange={(val) => handleToggle("AUDIOONLINE", val)}
            />
          </div>
          <div className="flex justify-between items-center">
            <span>Video Call</span>
            <Switch
              checked={isVideoOnline}
              onCheckedChange={(val) => handleToggle("VIDEOONLINE", val)}
            />
          </div>
        </Card>
      )}
      {/* Settings List */}
      <p className="text-sm text-gray-500 mb-3">{t("setting&preferences")}</p>
      <div className="space-y-2">
        {settingsOptions.map((item, i) => (
          <Card
            key={i}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handlePress(item.path)}
          >
            <div className="flex items-center justify-between p-4">
              <span>{t(item.title)}</span>
              {item.title !== "Logout" && <ChevronRight size={18} />}
              {item.title === "Logout" && <LogOutIcon size={18} />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettingPage;
