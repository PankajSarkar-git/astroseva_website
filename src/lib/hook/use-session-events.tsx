// src/hooks/use-session-events.ts

import { useEffect, useRef, useCallback, useState } from "react";
import { useAppDispatch } from "./redux-hook";
import { useUserRole } from "./use-role";
import { decodeMessageBody } from "../utils/utils";
import { WebSocket } from "../services/socket-service-new";
import {
  setActiveSession,
  setCallSession,
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

export const useSessionEvents = (
  userId: string = "",
  isAuthenticated: boolean = false
) => {
  const dispatch = useAppDispatch();
  const role = useUserRole();
  const subscriptionsRef = useRef<string[]>([]);

  // ✅ Track connection status in React state
  const [isConnected, setIsConnected] = useState(false);

  // ✅ Get websocket instance if initialized
  const ws = WebSocket.isInitialized() ? WebSocket.get() : null;

  const getTransactionDetails = useCallback(async () => {
    try {
      const payload = await dispatch(
        getTransactionHistory({ userId, query: `?page=1` })
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

  const unsubscribeAll = useCallback(() => {
    if (!ws) return;
    subscriptionsRef.current.forEach((dest) => {
      ws.unsubscribe(dest);
    });
    subscriptionsRef.current = [];
  }, [ws]);

  const subscribeAll = useCallback(() => {
    if (!isAuthenticated || !isConnected || !userId || !ws) return;

    unsubscribeAll();

    const queueDest = `/topic/queue/${userId}`;
    const requestDest = `/topic/chat/${userId}/chatId`;
    const callSessionDest = `/topic/call/${userId}/session`;
    const onlineAstroDest = `/topic/online/astrologer`;
    const activeSessionDest = `/topic/session/${userId}`;
    const onlineAstrologerDest = "/topic/online/astrologer/list";

    subscriptionsRef.current = [
      queueDest,
      requestDest,
      callSessionDest,
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

    ws.subscribe(callSessionDest, (msg) => {
      try {
        const sessionData = JSON.parse(decodeMessageBody(msg));
        dispatch(setCallSession(sessionData));
        getTransactionDetails();
      } catch (err) {
        console.log("Session details parse error:", err);
      }
    });

    ws.subscribe(requestDest, (msg) => {
      try {
        const data = JSON.parse(decodeMessageBody(msg));
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
        console.log("Failed to parse online astrologer:", err);
      }
    });

    ws.subscribe(onlineAstrologerDest, (msg) => {
      try {
        const data = JSON.parse(decodeMessageBody(msg));
        dispatch(setOnlineAstrologerDetails(data));
      } catch (err) {
        console.log("Failed to parse astrologer list:", err);
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
  }, [
    isAuthenticated,
    isConnected,
    userId,
    ws,
    dispatch,
    getTransactionDetails,
    role,
    unsubscribeAll,
  ]);

  useEffect(() => {
    if (!ws) return;

    // ✅ Register connection state updates
    const removeOnConnect = ws.addOnConnect(() => setIsConnected(true));
    const removeOnDisconnect = ws.addOnDisconnect(() => setIsConnected(false));

    // Initial state
    setIsConnected(ws.isConnected());

    return () => {
      removeOnConnect();
      removeOnDisconnect();
    };
  }, [ws]);

  useEffect(() => {
    if (isAuthenticated && isConnected && userId) {
      subscribeAll();
    }
    return () => {
      unsubscribeAll();
    };
  }, [subscribeAll, unsubscribeAll, isAuthenticated, isConnected, userId]);
};
