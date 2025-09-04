"use client";

import React from "react";
import { useUserRole } from "@/lib/hook/use-role";
import AstrologerProfileEdit from "./astrologer-profile-edit";
import UserProfileEditPage from "./edit-user";


const ProfileEditPage = () => {
  const role = useUserRole();

  return <>{role === "ASTROLOGER" ? <AstrologerProfileEdit /> : <UserProfileEditPage />}</>;
};

export default ProfileEditPage;
