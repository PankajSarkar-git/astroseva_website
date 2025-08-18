"user client";
import React from "react";
import { CallSession } from "@/lib/utils/types";
import { formatedDate, formatRelativeDate } from "@/lib/utils/utils";
import { VideoIcon, PhoneIcon } from "lucide-react"; // Replace with your custom icons if needed

interface CallHistoryCardProps {
  data: CallSession;
}

const CallHistoryCard: React.FC<CallHistoryCardProps> = ({ data }) => {
  const getCallIcon = (type: string) => {
    if (type === "VIDEO") {
      return <VideoIcon className="w-5 h-5 text-primary" />;
    }
    return <PhoneIcon className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="flex items-center justify-between border rounded-xl p-4 bg-white shadow-sm dark:bg-muted border-border">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <img
          src={data?.user?.imgUri || "/placeholder-avatar.png"}
          alt={data?.user?.name}
          className="w-14 h-14 rounded-full border-2 border-secondary"
        />

        <div>
          <div className="text-base font-medium text-foreground">
            {data?.user?.name}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatedDate(data.startedAt)}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col items-end">
        <span className="text-sm text-muted-foreground mb-2">
          {formatRelativeDate(data.startedAt)}
        </span>
        <div className="flex items-center">{getCallIcon(data.sessionType)}</div>
      </div>
    </div>
  );
};

export default CallHistoryCard;
