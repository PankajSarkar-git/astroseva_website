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
import ChatView from "./_components/chat-view";
import { is } from "date-fns/locale";

// Chat component converted from React Native

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
  console.log(isWaiting, "----iswaiting in chat screen");

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
    <PageWithNav hideNav={isWaiting}>
      {isWaiting ? (
        <div className="h-screen overflow-hidden flex justify-center items-center">
          <h1 className="font-semibold text-text-secondary">Waiting...</h1>
        </div>
      ) : (
        <div className={`flex md:pt-16`}>
          {/* Left Sidebar - Chat List */}
          <div
            className={`w-full h-screen md:h-[calc(100vh-4rem)] overflow-auto md:w-80 border-r border-gray-200 bg-white ${session?.id ? "hidden md:flex flex-col" : "flex flex-col"}`}
          >
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
          <div
            className={`${session?.id ? "" : "hidden"} md:block h-screen md:h-[calc(100vh-4rem)] relative overflow-auto flex-1 bg-gray-50`}
          >
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
