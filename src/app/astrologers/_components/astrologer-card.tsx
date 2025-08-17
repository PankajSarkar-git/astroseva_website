"use clinet";
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, MessageSquare, Star } from "lucide-react";

import { useAppSelector } from "@/lib/hook/redux-hook";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/lib/utils/utils";

type SessionType = "chat" | "audio" | "video";

type AstrologerCardProps = {
  id: string;
  name: string;
  rate: string;
  rating: number;
  experience: string;
  languages: string;
  imageUri: string;
  onCallPress?: () => void;
  onVideoPress?: () => void;
  onChatPress?: () => void;
  onSessionPress?: (sessionType: SessionType) => void;
  pricePerMinuteChat: number;
  pricePerMinuteVideo: number;
  pricePerMinuteVoice: number;
  expertise: string;
  online: boolean;
  freeChatAvailable?: boolean;
  className?: string;
};

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  id,
  name,
  rate,
  rating,
  experience,
  expertise,
  languages,
  imageUri,
  onCallPress,
  onVideoPress,
  onChatPress,
  onSessionPress,
  pricePerMinuteChat,
  pricePerMinuteVideo,
  pricePerMinuteVoice,
  online,
  freeChatAvailable = false,
  className = "",
}) => {
  const { user } = useAppSelector((state) => state.auth);
  //   const { isConnected, send } = useWebSocket(user?.id);

  //   const handleSessionPress = (sessionType: SessionType) => {
  //     if (!isConnected) {
  //       toast.error("Wait for connection, please.");
  //       return;
  //     }

  //     if (onSessionPress) {
  //       onSessionPress(sessionType);
  //     } else {
  //       // Fallback to old handlers for backward compatibility
  //       switch (sessionType) {
  //         case "audio":
  //           onCallPress?.();
  //           break;
  //         case "video":
  //           onVideoPress?.();
  //           break;
  //         case "chat":
  //           onChatPress?.();
  //           break;
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     if (send && user?.id) {
  //       send(
  //         "/app/session.active",
  //         {},
  //         JSON.stringify({ astrologerId: user?.id })
  //       );
  //     }
  //   }, [id, send, user?.id]);

  return (
    <Card
      className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <CardContent className="p-4">
        {/* Top Section - Avatar and Name */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="relative">
            <Avatar
              className={`w-15 h-15 border-2 ${
                online ? "border-green-500" : "border-red-500"
              }`}
            >
              <AvatarImage src={imageUri} alt={name} />
              <AvatarFallback className="text-lg font-semibold">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online Status Indicator */}
            <div
              className={`absolute -top-0 -right-0 w-4 h-4 rounded-full border-2 border-white ${
                online ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {name}
              </h3>
              {rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-2 mb-4">
          {experience && (
            <div>
              <p className="text-sm font-bold text-gray-900">Experience</p>
              <p className="text-sm text-gray-600">{experience}</p>
            </div>
          )}

          {expertise && (
            <div>
              <p className="text-sm font-bold text-gray-900">Expertise</p>
              <p className="text-sm text-gray-600">{expertise}</p>
            </div>
          )}

          {languages && (
            <div>
              <p className="text-sm font-bold text-gray-900">Language</p>
              <p className="text-sm text-gray-600">{languages}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Voice Call Button */}
          <Button
            variant="outline"
            size="sm"
            // onClick={() => handleSessionPress("audio")}
            className="flex-1 h-10 flex items-center justify-center space-x-2 py-2 px-3 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="p-1 bg-gray-800 rounded-full">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-900 truncate">
              {formatPrice
                ? formatPrice(pricePerMinuteVoice, "min")
                : `₹${pricePerMinuteVoice}/min`}
            </span>
          </Button>

          {/* Video Call Button */}
          <Button
            variant="outline"
            size="sm"
            // onClick={() => handleSessionPress("video")}
            className="flex-1 h-10 flex items-center justify-center space-x-2 py-2 px-3 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="p-1 bg-gray-800 rounded-full">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-900 truncate">
              {formatPrice
                ? formatPrice(pricePerMinuteVideo, "min")
                : `₹${pricePerMinuteVideo}/min`}
            </span>
          </Button>

          {/* Chat Button */}
          <Button
            variant={freeChatAvailable ? "default" : "outline"}
            size="sm"
            // onClick={() => handleSessionPress("chat")}
            className={`flex-1 h-10 flex items-center justify-center space-x-2 py-2 px-3 rounded-full transition-colors ${
              freeChatAvailable
                ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                freeChatAvailable ? "bg-white" : "bg-gray-800"
              }`}
            >
              <MessageSquare
                className={`w-4 h-4 ${
                  freeChatAvailable ? "text-green-600" : "text-white"
                }`}
              />
            </div>
            <span
              className={`text-xs font-semibold truncate ${
                freeChatAvailable ? "text-white" : "text-gray-900"
              }`}
            >
              {freeChatAvailable
                ? "Free Chat"
                : formatPrice
                ? formatPrice(pricePerMinuteChat, "min")
                : `₹${pricePerMinuteChat}/min`}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AstrologerCard;
