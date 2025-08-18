"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AstrologerCard from "./astrologer-card";
import TagSelector from "@/components/common/tag";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { getAllAstrologers } from "@/lib/store/reducer/astrologers";
import {
  setFreeChatUsed,
  setProfileModelToggle,
} from "@/lib/store/reducer/auth";
import RequestSessionModal from "./request-session-modal";
import { shuffleArray } from "@/lib/utils/utils";
import { Astrologers as AstrologersType, UserDetail } from "@/lib/utils/types";
import {
  sendSessionRequest,
  setIsWaiting,
  setOtherUser,
  setSession,
} from "@/lib/store/reducer/session";
import { useDebounce } from "@/lib/hook/use-debounce";
import { toast } from "react-hot-toast";
// import { useWebSocket } from "../hooks/use-socket-new";
import { Input } from "@/components/ui/input";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { WebSocket } from "@/lib/services/socket-service-new";

type SessionType = "chat" | "audio" | "video";

// Extended type for astrologer with pricing
interface AstrologerWithPricing extends UserDetail {
  pricePerMinuteChat: number;
  pricePerMinuteVideo: number;
  pricePerMinuteVoice: number;
}

const tags = [
  { id: "all", label: "All", icon: "✨" },
  { id: "love", label: "Love", icon: "❤️" },
  { id: "career", label: "Career", icon: "💼" },
  { id: "health", label: "Health", icon: "💊" },
  {
    id: "custom",
    label: "Custom",
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
];

type AstrologersRouteParams = {
  initialSearch?: string;
  sort?: string;
};

const Astrologers: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search");
  const sort = searchParams.get("sort");
  console.log(initialSearch);
  const [search, setSearch] = useState(initialSearch ? initialSearch : "");
  const debouncedSearch = useDebounce(search, 500);
  const [selected, setSelected] = useState<string[]>(["all"]);
  const [selectedAstrologer, setSelectedAstrologer] =
    useState<AstrologerWithPricing | null>(null);
  const [selectedSessionType, setSelectedSessionType] =
    useState<SessionType>("chat");
  const [astrologersData, setAstrologersData] = useState<AstrologersType[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { isProfileComplete } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { freeChatUsed } = useAppSelector((state) => state.auth.user);
  const activeSession = useAppSelector((state) => state.session.activeSession);
  const { onlineAstrologer } = useAppSelector((state) => state.astrologer);
  const { user } = useAppSelector((state) => state.auth);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastAstrologerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (hasMore && !isFetchingMore && !loading) {
            fetchAstrologersData(page + 1, true, debouncedSearch as string);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page]
  );
  const ws = WebSocket.get();
  // const { send } = useWebSocket(user.id);

  const fetchAstrologersData = async (
    pageNumber = 1,
    append = false,
    search = ""
  ) => {
    if (loading || isFetchingMore || (!hasMore && append)) return;

    try {
      if (append) setIsFetchingMore(true);
      else setLoading(true);

      const payload = await dispatch(
        getAllAstrologers(
          `?page=${pageNumber}&search=${search}&sort=${sort ?? ""}`
        )
      ).unwrap();

      if (payload.success) {
        const newData = payload.astrologers || [];
        setAstrologersData((prev) =>
          append ? [...prev, ...newData] : newData
        );
        setPage(payload.currentPage);
        setHasMore(!payload.isLastPage);
      }
    } catch (error) {
      console.error("Failed to fetch astrologers:", error);
    } finally {
      if (append) setIsFetchingMore(false);
      else setLoading(false);
    }
  };

  const requestSession = async (astrologer: AstrologerWithPricing) => {
    if (activeSession && activeSession?.astrologer?.id === astrologer.id) {
      setSession(activeSession);
      router.push("/chat");
      return;
    }

    try {
      const body = { astrologerId: astrologer?.id, duration: 2 };
      const payload = await dispatch(sendSessionRequest(body)).unwrap();

      if (payload.success) {
        if (!freeChatUsed) {
          dispatch(setFreeChatUsed());
        }
        dispatch(setOtherUser(astrologer));
        dispatch(setIsWaiting(true));
        router.push("/chat");
      } else {
        toast.error("Failed to send request");
      }
    } catch (err) {
      console.error("Session request failed:", err);
      toast.error("Failed to send request");
    }
  };

  const handleSessionStart = (
    astrologer: AstrologersType,
    sessionType: SessionType
  ) => {
    console.log(isProfileComplete, "---profile");
    console.log(freeChatUsed, "---free chat used");
    if (isProfileComplete) {
      const astrologerWithPricing: AstrologerWithPricing = {
        ...astrologer.user,
        pricePerMinuteChat: astrologer.pricePerMinuteChat,
        pricePerMinuteVideo: astrologer.pricePerMinuteVideo,
        pricePerMinuteVoice: astrologer.pricePerMinuteVoice,
      };

      if (freeChatUsed || sessionType === "audio" || sessionType === "video") {
        setSelectedAstrologer(astrologerWithPricing);
        setSelectedSessionType(sessionType);
        setIsRequestModalOpen(true);
      } else {
        if (sessionType === "chat") {
          requestSession(astrologerWithPricing);
        }
      }
    } else {
      dispatch(setProfileModelToggle());
    }
  };

  const handleAstrologerClick = (astrologerId: string) => {
    router.push(`/details-profile/${astrologerId}`);
  };

  useEffect(() => {
    setLoading(true);
    const shuffledData = shuffleArray(astrologersData);
    setAstrologersData(shuffledData);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selected]);

  useEffect(() => {
    if (user?.id) {
      ws.send(
        "/app/session.active",
        {},
        JSON.stringify({ astrologerId: user?.id })
      );
      ws.send("/app/online.user");
    }
    fetchAstrologersData(1, false, debouncedSearch as string);
  }, [debouncedSearch, sort, user?.id]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!astrologersData.length) return;

    const onlineSet = new Set(onlineAstrologer ?? []);

    setAstrologersData((prev) =>
      prev.map((a) => ({
        ...a,
        online: onlineSet.has(a.user.id),
      }))
    );
  }, [onlineAstrologer, loading, isFetchingMore]);

  const sortedAstrologers = astrologersData.sort((a, b) => {
    return (b.online === true ? 1 : 0) - (a.online === true ? 1 : 0);
  });

  if (loading && astrologersData.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-108">
        <div className="flex flex-col items-center">
          <Loader2Icon className="animate-spin duration-700 text-text-tertiary" />
          <p className="mt-4 text-sm font-montserrat">
            Fetching astrologer data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 pt-8">
      <div className="pt-18 pb-6">
        <div className="h-12 w-full bg-secondary-surface absolute top-0 rounded-b-2xl"></div>
        <div className="container mx-auto max-w-[600px] px-4 flex gap-4">
          <Input
            className="bg-white rounded-full h-10"
            leftIcon={<SearchIcon className="h-4 w-4" />}
            value={search ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value); // Update query string
              const params = new URLSearchParams(window.location.search);
              if (value) {
                params.set("search", value);
              } else {
                params.delete("search");
              }

              // Push new URL with updated query
              router.push(`?${params.toString()}`);
            }}
            placeholder="Search here for pandits"
          />
        </div>
      </div>

      <TagSelector
        tags={tags}
        selectedTags={selected}
        onChange={(tags) => setSelected(tags)}
        removable={false}
        multiSelect={false}
      />

      <div className="flex-1 pb-5 max-w-[1200px] mx-auto">
        {sortedAstrologers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            {sortedAstrologers.map((item, idx) => (
              <div
                ref={
                  idx === sortedAstrologers.length - 1
                    ? lastAstrologerRef
                    : null
                }
                key={`card-astrologer-${item.id}`}
                onClick={() => handleAstrologerClick(item.id)}
                className="mx-2.5 cursor-pointer"
              >
                <AstrologerCard
                  id={item.id}
                  online={item.online}
                  pricePerMinuteChat={item.pricePerMinuteChat}
                  pricePerMinuteVideo={item.pricePerMinuteVideo}
                  pricePerMinuteVoice={item.pricePerMinuteVoice}
                  expertise={item.expertise}
                  name={item?.user?.name}
                  rate={""}
                  rating={4}
                  experience={item?.experienceYears.toString()}
                  languages={item?.languages}
                  imageUri={item?.user?.imgUri}
                  freeChatAvailable={!freeChatUsed}
                  onSessionPress={(sessionType: SessionType) => {
                    console.log("chat button pressed", item, sessionType);
                    handleSessionStart(item, sessionType);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <p className="text-sm font-montserrat text-center">
              No astrologers found.
            </p>
          </div>
        )}
      </div>

      {isRequestModalOpen && (
        <RequestSessionModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedAstrologer(null);
          }}
          astrologer={selectedAstrologer}
          initialSessionType={selectedSessionType}
        />
      )}
    </div>
  );
};

export default Astrologers;
