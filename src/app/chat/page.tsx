"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  addMessage,
  clearActiveSession,
  getChatHistory,
  getChatMessages,
  prependMessages,
  setMessage,
} from "@/lib/store/reducer/session";
import { useUserRole } from "@/lib/hook/use-role";
import { ChatSession, UserDetail } from "@/lib/utils/types";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { setOtherUser, setSession } from "@/lib/store/reducer/session";
import { Loader2, MessageCircle, User } from "lucide-react";
import ChatHistoryCard from "./_components/chat-history-card";
import PageWithNav from "@/components/common/page-with-nav";
import FullScreenLoader from "@/components/full-screen-loader";
import { uploadImage } from "@/lib/store/reducer/general";
import { WebSocket } from "@/lib/services/socket-service-new";
import { showToast } from "@/components/common/toast";
import { decodeMessageBody } from "@/lib/utils/utils";
import { StompSubscription } from "@stomp/stompjs";

// Chat component converted from React Native
const ChatView = ({ session }: { session: any }) => {
  const role = useUserRole();
  const userId = useAppSelector((state) => state.auth.user.id);

  const tempOtherUser = useAppSelector((state) => state.session.otherUser);
  const otherUser =
    role === "ASTROLOGER"
      ? useAppSelector((state) => state.session.session?.user)
      : useAppSelector((state) => state.session.session?.astrologer);
  const otherUserId = !session ? tempOtherUser?.id : otherUser?.id;
  const { messages } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [timer, setTimer] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ref: topRef, inView: isTopInView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });
  console.log(session, "-----------------sesson in chat screen");
  // WebSocket hooks (assuming you have these converted for web)
  // const { subscribe, send, unsubscribe } = useWebSocket(userId);
  const ws = WebSocket.get();

  const resetScreen = () => {
    dispatch(setMessage([]));
    setCurrentPage(1);
    setHasMore(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert getChatMessages function
  const getChatMessagesDetails = async (page: number) => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const payload = await dispatch(
        getChatMessages(`/${session?.id}?page=${page}&size=${15}`)
      ).unwrap();
      if (payload.success) {
        if (page === 1) {
          dispatch(setMessage(payload.messages));
        } else {
          dispatch(prependMessages(payload.messages));
        }
        setCurrentPage(payload.currentPage);
        setHasMore(!payload.isLastPage);
      } else {
        // Handle error
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle text input + typing event
  const handleInputChange = (text: string) => {
    setInput(text);
    if (!session || !otherUser) return;

    // Send typing indicator via WebSocket

    ws?.send(
      `/app/chat.typing`,
      {},
      JSON.stringify({
        senderId: userId,
        receiverId: otherUser.id,
        sessionId: session.id,
        typing: true,
      })
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      ws?.send(
        `/app/chat.typing`,
        {},
        JSON.stringify({
          senderId: userId,
          receiverId: otherUser.id,
          sessionId: session.id,
          typing: false,
        })
      );
      typingTimeoutRef.current = null;
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    if (!session || session.status !== "ACTIVE" || !otherUserId) return;

    const newMsg = {
      senderId: userId,
      receiverId: otherUserId,
      sessionId: session.id,
      message: input.trim(),
      type: "TEXT",
      timestamp: new Date(),
    };

    ws?.send(`/app/chat.send`, {}, JSON.stringify(newMsg));
    dispatch(addMessage(newMsg));
    setInput("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!session || !otherUser?.id) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const payload = await dispatch(uploadImage(formData)).unwrap();

      if (payload?.success) {
        const newMsg = {
          senderId: userId,
          receiverId: otherUser.id,
          sessionId: session?.id,
          message: payload.imgUrl,
          type: "IMAGE",
          timestamp: new Date(),
        };
        ws?.send("/app/chat.send", {}, JSON.stringify(newMsg));
        dispatch(addMessage(newMsg));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      // Show toast or error message
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const messageSubDest = `/topic/chat/${userId}/messages`;
  const typingSubDest = `/topic/chat/${userId}/typing`;
  const timerSubDest = `/topic/chat/${session?.id}/timer`;
  const chatEndDest = `/topic/chat/${session?.id}`;

  useEffect(() => {
    let chatTimerSub: StompSubscription | undefined;
    let chatEndSub: StompSubscription | undefined;
    let chatMessage: StompSubscription | undefined;
    let typingSub: StompSubscription | undefined;

    if (session && session.status !== "ENDED") {
      chatMessage = ws?.subscribe(messageSubDest, (msg: any) => {
        try {
          const data = JSON.parse(decodeMessageBody(msg));
          dispatch(addMessage(data));
        } catch (err) {
          console.error("Failed to parse chat message:", err);
        }
      });
      typingSub = ws?.subscribe(typingSubDest, (msg: any) => {
        try {
          const data = JSON.parse(decodeMessageBody(msg));
          if (data.senderId === otherUserId) {
            setOtherUserTyping(data.typing);
          }
          console.log(JSON.parse(decodeMessageBody(msg)));
        } catch (err) {
          console.error("Failed to parse chat typing:", err);
        }
      });
      chatTimerSub = ws?.subscribe(timerSubDest, (msg: any) => {
        try {
          const data = decodeMessageBody(msg);

          setTimer(data);
        } catch (err) {
          console.error("Failed to parse chat message:", err);
        }
      });
      chatEndSub = ws?.subscribe(chatEndDest, (msg: any) => {
        try {
          const data = JSON.parse(decodeMessageBody(msg));
          if (data.status === "ended") {
            dispatch(
              setSession({
                ...session,
                status: data.status === "ended" ? "ENDED" : "ACTIVE",
              })
            );
            dispatch(clearActiveSession());
            showToast.info("Session Ended");
          }
        } catch (err) {
          console.error("Failed to parse chat end message:", err);
        }
      });
    }

    return () => {
      chatTimerSub && ws?.unsubscribe(timerSubDest);
      chatEndSub && ws?.unsubscribe(chatEndDest);
      chatMessage && ws?.unsubscribe(messageSubDest);
      typingSub && ws?.unsubscribe(typingSubDest);
    };
  }, [session]);

  useEffect(() => {
    console.log("this useeffect run");
    if (!session) return;
    resetScreen();
    getChatMessagesDetails(1);
  }, [session]);

  useEffect(() => {
    if (isTopInView && hasMore && !loading && session) {
      getChatMessagesDetails(currentPage + 1);
    }
  }, [isTopInView]);

  const renderMessage = (message: any, index: number) => {
    const isMine = message.senderId === userId;

    return (
      <div
        key={`${message.timestamp}-${index}`}
        className={`flex mb-4 ${isMine ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isMine
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800 border border-gray-200"
          }`}
        >
          {message.type === "IMAGE" ? (
            <div>
              <img
                src={message.message}
                alt="Shared image"
                className="w-48 h-48 object-cover rounded-lg cursor-pointer hover:opacity-90"
                onClick={() => {
                  setSelectedImage(message.message);
                  setImageModalVisible(true);
                }}
              />
              <p
                className={`text-xs mt-1 ${
                  isMine ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          ) : (
            <div>
              <p className="break-words">{message.message}</p>
              <p
                className={`text-xs mt-1 ${
                  isMine ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white flex justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {otherUser?.imgUri ? (
                <img
                  src={otherUser?.imgUri}
                  alt={otherUser?.name}
                  className="w-12 h-12 object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600">
                  {otherUser?.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            {/* Online status indicator */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                session?.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser?.name}</h3>
            <p
              className={`text-sm transition-opacity ${
                otherUserTyping
                  ? "text-blue-500 opacity-100"
                  : "text-transparent opacity-0"
              }`}
            >
              Typing...
            </p>
          </div>
        </div>

        {/* Timer */}
        {session?.status === "ACTIVE" && timer && (
          <div className="mt-2 text-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {timer}
            </span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      {!session ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Waiting for session to start...
            </h3>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => {
                /* handleLeave */
              }}
            >
              Leave Session
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {loading && (
            <div className="text-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
            </div>
          )}

          {messages.map((message, index) => {
            const isFirstMessage = index === 0;
            return (
              <div
                key={`${message.timestamp}-${index}`}
                ref={isFirstMessage ? topRef : null}
              >
                {renderMessage(message, index)}
              </div>
            );
          })}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3">
          {/* Camera/File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!session || session.status !== "ACTIVE"}
            className={`p-2 rounded-full transition-colors ${
              session && session.status === "ACTIVE"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type a message..."
            disabled={!session || session.status !== "ACTIVE"}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!session || session.status !== "ACTIVE" || !input.trim()}
            className={`p-2 rounded-full transition-colors ${
              session && session.status === "ACTIVE" && input.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>

          {/* Kundli Button (for Astrologers) */}
          {role === "ASTROLOGER" && (
            <button
              disabled={!session || session.status !== "ACTIVE"}
              className={`p-2 rounded-full transition-colors ${
                session && session.status === "ACTIVE"
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {imageModalVisible && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-4xl p-4">
            <button
              onClick={() => setImageModalVisible(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Empty state component
const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <MessageCircle className="w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold mb-2">
        Select a chat to start messaging
      </h3>
      <p className="text-center max-w-md">
        Choose a conversation from the left sidebar to view and continue your
        chat history.
      </p>
    </div>
  );
};

// No chats available state
const NoChatsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <MessageCircle className="w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No chats yet</h3>
      <p className="text-center max-w-md">
        Start your first conversation to see your chat history here.
      </p>
    </div>
  );
};

const ChatHistory: React.FC = () => {
  const [messageItems, setMessageItems] = useState<ChatSession[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const { isWaiting, session } = useAppSelector((state) => state.session);

  const role = useUserRole();

  const dispatch = useAppDispatch();

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const fetchChatHistory = async (page = 1) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const payload = await dispatch(
        getChatHistory(`?page=${page}&limit=15`)
      ).unwrap();
      if (payload.success) {
        const updatedItems =
          page === 1
            ? payload.chatHistory
            : [...messageItems, ...payload.chatHistory];

        setMessageItems(updatedItems);

        setCurrentPage(payload.currentPage);
        setHasMore(!payload.isLastPage);
        if (page === 1) setInitialLoadDone(true);
      } else {
        setMessageItems([]);
      }
    } catch (e) {
      // handle error
      console.error("Failed to fetch chat history:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [isWaiting]);

  useEffect(() => {
    if (inView && hasMore && !loading && initialLoadDone) {
      fetchChatHistory(currentPage + 1);
    }
  }, [inView]);

  const handleChatSelect = (item: ChatSession) => {
    const otherUser: UserDetail = role === "USER" ? item.astrologer : item.user;
    dispatch(setOtherUser(otherUser));
    console.log(item, "-----------session changing to this");
    dispatch(setSession(item));
  };

  const renderChatList = () => (
    <div className="space-y-2">
      {messageItems.map((item, index) => {
        const otherUser: UserDetail =
          role === "USER" ? item.astrologer : item.user;
        const isSelected = session?.id === item.id;

        return (
          <div
            key={`${item.id}-${index}`}
            onClick={() => handleChatSelect(item)}
            className={`cursor-pointer transition-all duration-200 rounded-lg ${
              isSelected
                ? "bg-blue-50 border-l-4 border-l-border-secondary"
                : "hover:bg-gray-50"
            }`}
          >
            <ChatHistoryCard data={item} active={item.status === "ACTIVE"} />
          </div>
        );
      })}
    </div>
  );

  if (loading && !initialLoadDone) {
    return <FullScreenLoader />;
  }

  console.log(session, "----session");

  return (
    <PageWithNav>
      {isWaiting ? (
        <div className="pt-20 min-h-screen flex justify-center items-center">
          <h1 className="font-semibold text-text-secondary">Waiting...</h1>
        </div>
      ) : (
        <div className="flex h-screen pt-16">
          {/* Left Sidebar - Chat List */}
          <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">
                {messageItems.length} conversation
                {messageItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4">
              {messageItems.length === 0 && initialLoadDone ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle className="w-12 h-12 mb-3" />
                  <p className="text-center">No conversations yet</p>
                </div>
              ) : (
                <>
                  {renderChatList()}
                  {loading && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  )}
                  {/* Infinite Scroll Trigger */}
                  <div ref={ref} className="h-10" />
                </>
              )}
            </div>
          </div>

          {/* Right Side - Chat View */}
          <div className="flex-1 bg-gray-50">
            {messageItems.length === 0 && initialLoadDone ? (
              <NoChatsState />
            ) : session ? (
              <ChatView session={session} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      )}
    </PageWithNav>
  );
};

export default ChatHistory;
