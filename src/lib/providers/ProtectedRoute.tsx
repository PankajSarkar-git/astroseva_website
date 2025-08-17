"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WebSocket } from "../services/socket-service-new";
import { useAppDispatch, useAppSelector } from "../hook/redux-hook";
import { userDetail } from "../store/reducer/user";
import {
  logout,
  setAstrologer,
  setAuthentication,
  setUser,
} from "../store/reducer/auth";
import FullScreenLoader from "@/components/full-screen-loader";
import { useSessionEvents } from "../hook/use-session-events";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // ← Make sure it's true on mount
  const [hydrated, setHydrated] = useState(false); // ← Add hydration flag
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const websocketUrl = "https://backend.astrosevaa.com/ws-chat";

  const { subscribeToSessionEvents, unsubscribeFromSessionEvents } =
    useSessionEvents(user.id);

  // STEP 1: Wait for hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // STEP 2: Check authentication AFTER hydration
  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = async () => {
      if (!token) {
        dispatch(logout());
        setLoading(false);
        return;
      }

      try {
        const { payload } = await dispatch(userDetail());

        if (payload?.success) {
          const userDetail: any = payload.user ?? payload.astrologer?.user!;

          const astro = payload.astrologer;
          const astrologer_detail: any = astro
            ? {
                id: astro.id ?? "",
                about: astro.about ?? "",
                blocked: astro.blocked ?? false,
                experienceYears: astro.experienceYears ?? 0,
                expertise: astro.expertise ?? "",
                imgUri: astro.imgUri ?? "",
                languages: astro.languages ?? "",
                pricePerMinuteChat: astro.pricePerMinuteChat ?? 0,
                pricePerMinuteVoice: astro.pricePerMinuteVoice ?? 0,
                pricePerMinuteVideo: astro.pricePerMinuteVideo ?? 0,
              }
            : null;

          dispatch(setAuthentication(true));
          dispatch(setUser(userDetail));
          if (astrologer_detail) dispatch(setAstrologer(astrologer_detail));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error(err);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [hydrated, token, dispatch]);

  // STEP 3: Initialize WebSocket only when hydrated + authenticated
  useEffect(() => {
    if (!hydrated || !user?.id || !isAuthenticated) return;

    WebSocket.init(user.id, websocketUrl)
      .connect()
      .then(() => {
        console.log("WebSocket connected");
        subscribeToSessionEvents();
        WebSocket.get().send("/app/online.user");
      })
      .catch((err) => {
        console.error("WebSocket connection failed:", err);
      });

    return () => {
      unsubscribeFromSessionEvents();
      WebSocket.get().disconnect();
      WebSocket.reset();
    };
  }, [
    hydrated,
    isAuthenticated,
    user.id,
    subscribeToSessionEvents,
    unsubscribeFromSessionEvents,
  ]);

  // STEP 4: Redirect to login after auth check
  useEffect(() => {
    if (!loading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading || !hydrated) {
    return <FullScreenLoader />;
  }

  return children;
}
