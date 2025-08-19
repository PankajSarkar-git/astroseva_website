"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Video,
  MessageSquare,
  Users,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { UserDetail } from "@/lib/utils/types";
import { WebSocket } from "@/lib/services/socket-service-new";
import { showToast } from "@/components/common/toast";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import {
  acceptSessionRequest,
  clearSession,
  deleteSessionRequest,
  getQueueRequest,
  setQueueCount,
  skipSessionRequest,
} from "@/lib/store/reducer/session";
import { useRouter } from "next/navigation";
import PageWithNav from "@/components/common/page-with-nav";

// Mock data for demonstration
const mockRequests = [
  {
    userId: "1",
    sessionType: "VIDEO",
    requestedMinutes: 30,
    queuePosition: 1,
    user: {
      id: "1",
      name: "John Doe",
      imgUri:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      birthDate: "25",
      birthPlace: "New York",
      birthTime: "10:30 AM",
    },
  },
  {
    userId: "2",
    sessionType: "AUDIO",
    requestedMinutes: 45,
    queuePosition: 2,
    user: {
      id: "2",
      name: "Sarah Wilson",
      imgUri: "",
      birthDate: "28",
      birthPlace: "California",
      birthTime: "2:15 PM",
    },
  },
  {
    userId: "3",
    sessionType: "CHAT",
    requestedMinutes: 20,
    queuePosition: 3,
    user: {
      id: "3",
      name: "Michael Chen",
      imgUri:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      birthDate: "32",
      birthPlace: "Boston",
      birthTime: "8:45 AM",
    },
  },
];

const CallTypeIcon = ({ type }: { type: "AUDIO" | "VIDEO" | "CHAT" }) => {
  const iconProps = { size: 16, className: "text-gray-600" };

  switch (type) {
    case "AUDIO":
      return <Phone {...iconProps} />;
    case "VIDEO":
      return <Video {...iconProps} />;
    case "CHAT":
      return <MessageSquare {...iconProps} />;
    default:
      return <MessageSquare {...iconProps} />;
  }
};

type RequestType = {
  userId: string;
  sessionType: "AUDIO" | "VIDEO" | "CHAT";
  requestedMinutes: number;
  queuePosition: number;
  user: UserDetail;
};

const UserRequestCard = ({
  data,
  onAccept,
  onSkip,
  showActions,
  isAnimating,
}: {
  data: RequestType;
  onAccept: () => void;
  onSkip: () => void;
  showActions: boolean;
  isAnimating: boolean;
}) => {
  const [isSliding, setIsSliding] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAcceptPress = async () => {
    setIsAccepting(true);
    setTimeout(() => {
      onAccept();
      setIsAccepting(false);
    }, 300);
  };

  const handleSkipPress = () => {
    setIsSliding(true);
    setTimeout(() => {
      onSkip();
      setIsSliding(false);
    }, 300);
  };

  return (
    <div
      className={`transform transition-all duration-300 ${
        isSliding ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      } ${isAccepting ? "scale-95" : "scale-100"}`}
    >
      <div
        className={`bg-white rounded-2xl mb-4 p-5 shadow-lg border-2 transition-colors ${
          showActions ? "border-blue-200" : "border-gray-200"
        } hover:shadow-xl`}
      >
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-center mb-4">
          {/* Avatar */}
          <div className="w-15 h-15 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200 overflow-hidden flex-shrink-0">
            {data?.user?.imgUri ? (
              <img
                src={data.user.imgUri}
                alt={data?.user?.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-xl font-bold text-gray-600">
                {data?.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[70%]">
                {data?.user?.name || "Anonymous"}
              </h3>

              {/* Call Type Badge */}
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full gap-1 flex-shrink-0">
                <CallTypeIcon type={data?.sessionType || "CHAT"} />
                <span className="text-xs font-medium text-gray-700">
                  {data?.sessionType || "CHAT"}
                </span>
              </div>
            </div>

            {/* Age and Location */}
            <p className="text-sm text-gray-500 mb-1">
              {data?.user?.birthDate ? `${data.user.birthDate} years` : ""}
              {data?.user?.birthPlace && data?.user?.birthDate ? " • " : ""}
              {data?.user?.birthPlace || ""}
              {data?.user?.birthTime &&
              (data?.user?.birthPlace || data?.user?.birthDate)
                ? " • "
                : ""}
              {data?.user?.birthTime || ""}
            </p>

            {/* Online Status */}
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-green-600 font-medium">
                Online now
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only for first card */}
        {showActions && (
          <div className="flex gap-3">
            <button
              onClick={handleSkipPress}
              disabled={isAnimating}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <XCircle size={16} />
              Skip
            </button>

            <button
              onClick={handleAcceptPress}
              disabled={isAnimating}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              Accept
            </button>
          </div>
        )}

        {/* Queue Position Indicator */}
        {!showActions && (
          <div className="absolute top-3 right-3 bg-gray-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
            {data?.queuePosition || ""}
          </div>
        )}
      </div>
    </div>
  );
};

const RequestScreen = () => {
  //   const [requests, setRequests] = useState(mockRequests);
  const [isAnimating, setIsAnimating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState("requests");
  const [request, setRequest] = useState<RequestType[]>([]);
  const ws = WebSocket.get();
  const isConnected = ws.isConnected();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const astrologer_detail = useAppSelector((state) => state.auth.user);
  const { user } = useAppSelector((state) => state.auth);
  const quequeRequestCount = useAppSelector(
    (state) => state.session.queueRequestCount
  );

  const getAllRequests = async () => {
    try {
      setRefreshing(true);
      const payload = await dispatch(getQueueRequest()).unwrap();

      if (payload.success) {
        // Add queue positions and mock call types for demo
        const usersWithExtras = payload?.users.map(
          (user: any, index: number) => ({
            ...user,
            queuePosition: index + 1,
          })
        );
        setRequest(usersWithExtras);
        dispatch(setQueueCount(usersWithExtras.length));
      } else {
        showToast.error("Something went wrong! try again");
      }
    } catch (err) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcceptCall = async (user: any) => {
    console.log("Accepting call/video request:", user);

    // For video/audio calls, redirect to call page without API call
    if (user.sessionType === "VIDEO" || user.sessionType === "AUDIO") {
      router.push("/applink");
      return;
    }
  };

  const handleAcceptChat = async (user: RequestType) => {
    if (isAnimating) return;
    if (!isConnected) {
      showToast.warning("Server not connected. Please try again later.");
      return;
    }

    setIsAnimating(true);
    try {
      const payload = await dispatch(
        acceptSessionRequest(user.userId)
      ).unwrap();

      if (payload.success) {
        // dispatch(setOtherUser(user));
        if (user.sessionType === "CHAT") {
          const sessionData = {
            sessionType: "CHAT",
            astrologer: {
              id: astrologer_detail?.id,
              name: astrologer_detail?.name,
              imageUri: astrologer_detail?.imgUri,
            },
            user: {
              id: user.userId,
              name: "User",
              imageUri: "",
            },
            duration: 30,
            sessionId: undefined,
            isAstrologer: true,
          };
          const query = new URLSearchParams({
            data: JSON.stringify(sessionData),
          }).toString();
          router.push("chat");
        } else {
          showToast.error("Something went wrong. Try again later.");
          return;
        }
      }
    } catch (err) {
    } finally {
      setIsAnimating(false);
      getAllRequests();
    }
  };

  const handleDelete = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    try {
      const payload = await dispatch(deleteSessionRequest()).unwrap();

      if (payload.success) {
        getAllRequests();
      }
    } catch (err) {
    } finally {
      setIsAnimating(false);
    }
  };

  const handleSkip = async (user: RequestType) => {
    if (isAnimating) return;
    if (!isConnected) {
      showToast.warning("Socket not connected! wait a moment and try again");
      return;
    }
    setIsAnimating(true);
    try {
      const payload = await dispatch(skipSessionRequest(user.userId)).unwrap();

      if (payload.success) {
        dispatch(clearSession());
        // Remove the skipped user and update queue positions
        const updatedRequests = request
          .filter((req) => req.userId !== user.userId)
          .map((req, index) => ({ ...req, queuePosition: index + 1 }));
        setRequest(updatedRequests);
      }
    } catch (err) {
    } finally {
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    ws.send(
      "/app/session.active",
      {},
      JSON.stringify({ astrologerId: user?.id })
    );
    getAllRequests();
  }, [quequeRequestCount]);

  return (
    <PageWithNav>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold text-gray-900">All Requests</h1>
              {request.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {request.length}
                </span>
              )}
            </div>
            <button
              onClick={handleDelete}
              disabled={isAnimating}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete All</span>
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          {/* Header */}

          {/* Main Content */}
          <div className="px-4 sm:px-6 py-6">
            {request.length > 0 ? (
              <div className="space-y-0">
                {request.map((user, index) => (
                  <UserRequestCard
                    key={`${index}-${user?.userId}`}
                    data={user}
                    onAccept={() =>
                      user.sessionType === "CHAT"
                        ? handleAcceptChat(user)
                        : handleAcceptCall(user)
                    }
                    onSkip={() => handleSkip(user)}
                    showActions={index === 0}
                    isAnimating={isAnimating}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md mx-auto">
                  <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Users className="text-blue-500" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Requests Yet
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    When someone wants to connect with you, you'll see their
                    request here. Stay online to receive new requests.
                  </p>

                  <button
                    onClick={getAllRequests}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    <RefreshCw
                      size={16}
                      className={refreshing ? "animate-spin" : ""}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWithNav>
  );
};

export default RequestScreen;
