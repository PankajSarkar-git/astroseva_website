"use client";
import React, { useState } from "react";
import Navbar from "./navbar";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { UserPersonalDetail } from "@/lib/utils/types";
import { setProfileModelToggle, setUser } from "@/lib/store/reducer/auth";
import { postUserDetail } from "@/lib/store/reducer/user";
import PersonalDetailModal from "./personal-detail-modal";

function PageWithNav({ children }: { children: React.ReactNode }) {
  const { isProfileModalOpen, isProfileComplete } = useAppSelector(
    (state) => state.auth
  );
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useAppDispatch();
  const handlePostUserData = async (user: UserPersonalDetail) => {
    setIsSaving(true);
    try {
      const payload = await dispatch(postUserDetail(user)).unwrap();

      if (payload?.success) {
        dispatch(setUser(payload.user));
        dispatch(setProfileModelToggle());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="h-full w-full">
      <div className="fixed w-full top-0 z-[50]">
        <Navbar />
      </div>
      <div>{children}</div>
      {!isProfileComplete && isProfileModalOpen && (
        <PersonalDetailModal
          parent={"screen layout personal modal"}
          isSaving={isSaving}
          isOpen={isProfileModalOpen && !isProfileComplete}
          onClose={() => {
            if (isProfileModalOpen) {
              dispatch(setProfileModelToggle());
            }
          }}
          onSubmit={(data) => {
            handlePostUserData(data);
          }}
        />
      )}
    </div>
  );
}

export default PageWithNav;
