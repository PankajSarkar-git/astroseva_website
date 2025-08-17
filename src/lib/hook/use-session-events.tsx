// src/hooks/use-session-events.ts

import { useRef, useCallback } from "react";
import { useAppDispatch } from "./redux-hook";
import { useUserRole } from "./use-role";
import { decodeMessageBody } from "../utils/utils";

import {
  setActiveSession,
  setCallSession,
  setIsWaiting,
  setSession,
  toggleCountRefresh,
} from "../store/reducer/session";
import {
  setOnlineAstrologer,
  setOnlineAstrologerDetails,
} from "../store/reducer/astrologers";
import { setBalance } from "../store/reducer/auth";
import { getTransactionHistory } from "../store/reducer/payment";
import { showToast } from "@/components/common/toast";
import { WebSocket } from "../services/socket-service-new";

export const useSessionEvents = (userId: string = "") => {
  const dispatch = useAppDispatch();
  const role = useUserRole();
  const subscriptionsRef = useRef<string[]>([]);

  const getTransactionDetails = useCallback(async () => {
    try {
      const payload = await dispatch(
        getTransactionHistory({ userId: userId, query: `?page=1` })
      ).unwrap();

      if (payload.success) {
        dispatch(setBalance({ balance: payload?.wallet?.balance ?? 0 }));
      } else {
        showToast.error("Failed to get transactions");
      }
    } catch (err) {
      showToast.error("Failed to get transactions");
    }
  }, [dispatch, userId]);

  const subscribeToSessionEvents = useCallback(() => {
    if (!userId) return;

    const ws = WebSocket.get();

    const queueDest = `/topic/queue/${userId}`;
    const requestDest = `/topic/chat/${userId}/chatId`;

    const onlineAstroDest = `/topic/online/astrologer`;
    const activeSessionDest = `/topic/session/${userId}`;
    const onlineAstrologerDest = "/topic/online/astrologer/list";

    unsubscribeFromSessionEvents();

    subscriptionsRef.current = [
      queueDest,
      requestDest,
      onlineAstroDest,
      activeSessionDest,
      onlineAstrologerDest,
    ];

    ws.subscribe(queueDest, (msg) => {
      try {
        const res = JSON.parse(decodeMessageBody(msg));
        dispatch(toggleCountRefresh());
        showToast.success(res.msg);
      } catch (err) {
        console.log("Failed to parse queue message:", err);
      }
    });

    ws.subscribe(requestDest, (msg) => {
      try {
        const data = JSON.parse(decodeMessageBody(msg));
        setIsWaiting(false);
        dispatch(setActiveSession(data));
        dispatch(setSession(data));
        getTransactionDetails();
        showToast.info(
          role === "USER"
            ? "Request accepted by the astrologer"
            : "Session will start soon"
        );
      } catch (err) {
        console.log("Failed to parse chat id:", err);
      }
    });

    ws.subscribe(onlineAstroDest, (msg) => {
      try {
        const data = JSON.parse(decodeMessageBody(msg));
        dispatch(setOnlineAstrologer(data));
      } catch (err) {
        console.log("Failed to parse online astrologer list:", err);
      }
    });

    ws.subscribe(onlineAstrologerDest, (msg) => {
      try {
        const data = JSON.parse(decodeMessageBody(msg));
        dispatch(setOnlineAstrologerDetails(data));
      } catch (err) {
        console.log("Failed to parse online astrologer details:", err);
      }
    });

    ws.subscribe(activeSessionDest, (msg) => {
      try {
        const data = JSON.parse(decodeMessageBody(msg));
        console.log("Active session update:", data);
      } catch (err) {
        console.log("Failed to parse active session data:", err);
      }
    });
  }, [dispatch, getTransactionDetails, role, userId]);

  const unsubscribeFromSessionEvents = useCallback(() => {
    const ws = WebSocket.get();
    subscriptionsRef.current.forEach((dest) => {
      ws.unsubscribe(dest);
    });
    subscriptionsRef.current = [];
  }, []);

  return {
    subscribeToSessionEvents,
    unsubscribeFromSessionEvents,
  };
};
