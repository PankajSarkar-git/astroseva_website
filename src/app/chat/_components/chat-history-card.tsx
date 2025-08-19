"use client";
import React from "react";
import { ChatSession } from "@/lib/utils/types";
import { formatedDate, formatRelativeDate } from "@/lib/utils/utils";
import { useUserRole } from "@/lib/hook/use-role";

interface ChatHistoryCardProps {
  data: ChatSession;
  active: boolean;
}

const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({ data, active }) => {
  const role = useUserRole();
  const otherUser = role === "ASTROLOGER" ? data.user : data.astrologer;

  return (
    <div
      className={`flex items-start justify-between border rounded-xl px-5 py-3 mb-3 ${
        active ? "border-accent shadow-md" : "border-border"
      } bg-background`}
    >
      {/* Left Section: Avatar + Name + Date */}
      <div className="flex items-center gap-4">
        {otherUser?.imgUri ? (
          <img
            src={otherUser.imgUri}
            alt={otherUser.name}
            className="w-[55px] h-[55px] rounded-full border-2 border-muted object-cover"
          />
        ) : (
          <div className="w-[55px] h-[55px] rounded-full border-2 border-muted bg-muted flex items-center justify-center text-lg font-semibold text-text-secondary">
            {otherUser.name.charAt(0)}
          </div>
        )}

        <div className="flex flex-col justify-center">
          <span className="text-[16px] font-medium text-foreground">
            {otherUser.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatedDate(data.startedAt)}
          </span>
        </div>
      </div>

      {/* Right Section: Relative Time */}
      <span className="text-sm text-muted-foreground mt-2">
        {formatRelativeDate(data.startedAt)}
      </span>
    </div>
  );
};

export default ChatHistoryCard;
