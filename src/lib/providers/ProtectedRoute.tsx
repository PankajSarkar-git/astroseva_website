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
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const websocketUrl = "https://backend.astrosevaa.com/ws-chat";

  const { subscribeToSessionEvents, unsubscribeFromSessionEvents } =
    useSessionEvents(user.id);

  useEffect(() => {
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
  }, [token, dispatch]);

  useEffect(() => {
    if (!user.id) return;

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
  }, [user.id, subscribeToSessionEvents, unsubscribeFromSessionEvents]);

  useEffect(() => {
    if (!loading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return children;
}
