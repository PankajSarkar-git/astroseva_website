"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { MessageSquareIcon, Phone, Video } from "lucide-react";
import { useAppSelector } from "@/lib/hook/redux-hook";
import { useUserRole } from "@/lib/hook/use-role";

const ProfilePage = () => {
  const role = useUserRole();
  const isAstrologer = role === "ASTROLOGER";
  const { user, astrologer_detail } = useAppSelector((state) => state.auth);

  const profileImage =
    user?.gender === "MALE" || !user?.gender
      ? "/imgs/male.jpg"
      : "/imgs/female.jpg";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 relative">
        <Image
          src={user?.imgUri || profileImage}
          alt="Profile"
          width={80}
          height={80}
          className="rounded-xl border border-gray-300"
        />
        <div>
          <h1 className="text-xl font-semibold">{user?.name || "N/A"}</h1>
          <p className="text-gray-600">{`+91 ${user?.mobile || "__"}`}</p>
        </div>
        <Button
          size="icon"
          className="absolute right-0 bg-button-primary hover:bg-button-secondary"
          onClick={() => {
            // Navigate to profile edit
            window.location.href = "/profile/edit";
          }}
        >
          ✏️
        </Button>
      </div>

      {/* About Me */}
      {isAstrologer && (
        <Card className="p-4">
          <h2 className="font-bold mb-2">About Me</h2>
          <p>{astrologer_detail?.about ?? "___"}</p>
        </Card>
      )}

      {/* Personal Details */}
      <Card className="p-4 space-y-1">
        <h2 className="font-bold mb-2">Personal Details</h2>
        <p>Name: {user?.name ?? "__"}</p>
        <p>Expertise: {astrologer_detail?.expertise ?? "__"}</p>
        <p>
          Experience: {astrologer_detail?.experienceYears ?? "__"} years
        </p>
        {isAstrologer && <p>Languages: {astrologer_detail?.languages ?? "__"}</p>}
        {!isAstrologer && <p>DOB: {user?.birthDate ?? "__"}</p>}
        {!isAstrologer && <p>TOB: {user?.birthTime ?? "__"}</p>}
        {!isAstrologer && <p>POB: {user?.birthPlace ?? "__"}</p>}
      </Card>

      {/* Address */}
      {!isAstrologer && (
        <Card className="p-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Home size={16} className="text-red-500" />
          <p>{user?.birthPlace ?? "__"}</p>
          </div>
        </Card>
      )}

      {/* Services */}
      {isAstrologer && (
        <Card className="p-4 space-y-3">
          <h2 className="font-bold mb-2">Services</h2>

          {[
            { icon: <MessageSquareIcon size={16} />, name: "Chat", price: astrologer_detail?.pricePerMinuteChat },
            { icon: <Phone size={16} />, name: "Audio Call", price: astrologer_detail?.pricePerMinuteVoice },
            { icon: <Video size={16} />, name: "Video Call", price: astrologer_detail?.pricePerMinuteVideo },
          ].map((service, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-red-100 px-3 py-2 rounded-full"
            >
              <div className="flex items-center gap-2">
                {service.icon}
                <span>{service.name}</span>
              </div>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                {service.price} / min
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
