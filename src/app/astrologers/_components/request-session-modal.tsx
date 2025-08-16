import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomModal from "@/components/common/modal";

import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import {
  sendCallRequest,
  sendSessionRequest,
  setOtherUser,
} from "@/lib/store/reducer/session";
import { UserDetail } from "@/lib/utils/types";
import { toast } from "react-hot-toast";
import { MessageCircle, Phone, Video } from "lucide-react";

type SessionType = "chat" | "audio" | "video";

interface DurationOption {
  label: string;
  id: string;
  value: number;
}

interface SessionTypeOption {
  id: SessionType;
  label: string;
  icon: React.ReactNode;
  priceKey:
    | "pricePerMinuteChat"
    | "pricePerMinuteVoice"
    | "pricePerMinuteVideo";
}

interface AstrologerWithPricing extends UserDetail {
  pricePerMinuteChat: number;
  pricePerMinuteVideo: number;
  pricePerMinuteVoice: number;
}

const RequestSessionModal = ({
  isOpen,
  onClose,
  astrologer,
  initialSessionType = "chat",
}: {
  isOpen: boolean;
  onClose: () => void;
  astrologer: AstrologerWithPricing | null;
  initialSessionType?: SessionType;
}) => {
  const durationOptions: DurationOption[] = [
    { label: "5 min", id: "5m", value: 5 },
    { label: "10 min", id: "10m", value: 10 },
    { label: "15 min", id: "15m", value: 15 },
    { label: "30 min", id: "30m", value: 30 },
    { label: "1 hour", id: "1h", value: 60 },
  ];

  const sessionTypes: SessionTypeOption[] = [
    {
      id: "chat",
      label: "Chat",
      icon: <MessageCircle height={20} width={20} color={"#ffffff"} />,
      priceKey: "pricePerMinuteChat",
    },
    {
      id: "audio",
      label: "Voice Call",
      icon: <Phone color={"#ffffff"} height={20} width={20} />,
      priceKey: "pricePerMinuteVoice",
    },
    {
      id: "video",
      label: "Video Call",
      icon: <Video color={"#ffffff"} size={20} />,
      priceKey: "pricePerMinuteVideo",
    },
  ];

  const [selectedDuration, setSelectedDuration] =
    useState<DurationOption | null>(null);
  const [selectedSessionType, setSelectedSessionType] =
    useState<SessionType>(initialSessionType);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get user wallet balance from Redux store
  const { user } = useAppSelector((state) => state.auth);
  const walletBalance = user?.walletBalance || 0;

  // Get astrologer pricing from the astrologer prop
  const astrologerPricing = astrologer
    ? {
        pricePerMinuteChat: astrologer.pricePerMinuteChat,
        pricePerMinuteVoice: astrologer.pricePerMinuteVoice,
        pricePerMinuteVideo: astrologer.pricePerMinuteVideo,
      }
    : {
        pricePerMinuteChat: 0,
        pricePerMinuteVoice: 0,
        pricePerMinuteVideo: 0,
      };

  // Reset session type when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSessionType(initialSessionType);
    }
  }, [isOpen, initialSessionType]);

  // Calculate total cost when duration or session type changes
  useEffect(() => {
    if (selectedDuration && astrologer) {
      const sessionTypeOption = sessionTypes.find(
        (type) => type.id === selectedSessionType
      );
      if (sessionTypeOption) {
        const pricePerMinute = astrologerPricing[sessionTypeOption.priceKey];
        const cost = pricePerMinute * selectedDuration.value;
        setTotalCost(cost);
      }
    }
  }, [selectedDuration, selectedSessionType, astrologer, astrologerPricing]);

  // Check if user has sufficient balance
  const hasSufficientBalance = totalCost <= walletBalance;
  const canProceed = selectedDuration && hasSufficientBalance;

  const handleDurationSelect = (duration: DurationOption) => {
    setSelectedDuration(duration);
  };

  const handleSessionTypeSelect = (type: SessionType) => {
    setSelectedSessionType(type);
  };

  const requestSession = async () => {
    if (!selectedDuration || !astrologer || !hasSufficientBalance) {
      const message = !selectedDuration
        ? "Please select a duration"
        : !hasSufficientBalance
        ? "Insufficient wallet balance"
        : "Please try again";

      toast.error(message);
      return;
    }

    try {
      setLoading(true);
      const body = {
        astrologerId: astrologer?.id,
        duration: selectedDuration.value,
        type: selectedSessionType.toUpperCase(),
      };

      let payload;

      if (selectedSessionType === "chat") {
        payload = await dispatch(sendSessionRequest(body)).unwrap();
      } else {
        payload = await dispatch(sendCallRequest(body)).unwrap();
      }

      if (payload.success) {
        dispatch(setOtherUser(astrologer));
        onClose();

        if (selectedSessionType === "chat") {
          router.push("/chat");
        } else {
          router.push({
            pathname: "/call",
            query: {
              callType: selectedSessionType?.toUpperCase(),
              astrologerId: astrologer.id,
              astrologerName: astrologer.name,
              duration: selectedDuration.value,
              sessionId: payload.sessionId || `session_${Date.now()}`,
            },
          });
        }
      }
    } catch (err) {
      console.log("sendSessionRequest Error : ", err);
      toast.error("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = () => {
    const sessionTypeOption = sessionTypes.find(
      (type) => type.id === selectedSessionType
    );
    if (sessionTypeOption) {
      return astrologerPricing[sessionTypeOption.priceKey];
    }
    return 0;
  };

  return (
    <CustomModal
      parent="request-session"
      header={{
        title: "Start Session",
        description: `Connect with ${astrologer?.name || "Astrologer"}`,
      }}
      visible={isOpen}
      onClose={onClose}
      footer={
        <div>
          {/* Cost Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-montserrat text-gray-600">
                Session Type:
              </span>
              <span className="text-sm font-semibold font-montserrat text-gray-900">
                {
                  sessionTypes.find((type) => type.id === selectedSessionType)
                    ?.label
                }
              </span>
            </div>

            {selectedDuration && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-montserrat text-gray-600">
                    Duration:
                  </span>
                  <span className="text-sm font-semibold font-montserrat text-gray-900">
                    {selectedDuration.label}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-montserrat text-gray-600">
                    Rate:
                  </span>
                  <span className="text-sm font-semibold font-montserrat text-gray-900">
                    ₹{getCurrentPrice()}/min
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-300 pt-2 mt-1">
                  <span className="text-base font-bold font-montserrat text-gray-900">
                    Total Cost:
                  </span>
                  <span className="text-base font-bold font-montserrat text-green-600">
                    ₹{totalCost}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm font-montserrat text-gray-600">
                Wallet Balance:
              </span>
              <span
                className={`text-sm font-semibold font-montserrat ${
                  hasSufficientBalance ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{walletBalance}
              </span>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {!hasSufficientBalance && selectedDuration && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-montserrat text-gray-900 text-center">
                ⚠️ Insufficient balance. Please add ₹{totalCost - walletBalance}{" "}
                to your wallet.
              </p>
            </div>
          )}

          <CustomButton
            title={loading ? "Starting Session..." : "Start Session"}
            onPress={requestSession}
            disabled={!canProceed}
            loading={loading}
            className={`rounded-full py-3.5 ${
              canProceed ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
            } transition-colors duration-200`}
            textClassName="text-white font-montserrat"
          />
        </div>
      }
    >
      {/* Duration Selection */}
      <div className="mb-6">
        <h3 className="text-base font-bold font-montserrat text-gray-900 mb-3">
          Choose Duration
        </h3>
        <div className="flex flex-wrap gap-3">
          {durationOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleDurationSelect(item)}
              className={`flex items-center py-3 px-4 rounded-full border transition-all duration-200 min-w-[45%] ${
                selectedDuration?.id === item.id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                  selectedDuration?.id === item.id
                    ? "border-green-600 bg-green-600"
                    : "border-gray-400 bg-white"
                }`}
              >
                {selectedDuration?.id === item.id && (
                  <CheckIcon size={12} color="#ffffff" />
                )}
              </div>
              <span
                className={`text-sm font-semibold font-montserrat ${
                  selectedDuration?.id === item.id
                    ? "text-green-600"
                    : "text-gray-900"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </CustomModal>
  );
};

export default RequestSessionModal;
