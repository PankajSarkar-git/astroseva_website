import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hook";
import {
  getQueueRequest,
  setQueueCount,
  toggleCountRefresh,
} from "../store/reducer/session";
import { showToast } from "@/components/common/toast";

export const useQueueCountOnResume = (
  isAuthenticated: boolean,
  role: string
) => {
  const dispatch = useAppDispatch();
  const { countRefresh } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (!isAuthenticated || role !== "ASTROLOGER" || !countRefresh) return;

    const fetchQueueCount = async () => {
      try {
        const payload = await dispatch(getQueueRequest()).unwrap();
        if (payload.success) {
          dispatch(setQueueCount(payload?.users?.length));
        } else {
          showToast.error("Something went wrong! Try again.");
        }
      } catch (err) {
        console.error("Queue fetch failed:", err);
      } finally {
        dispatch(toggleCountRefresh());
      }
    };

    fetchQueueCount();
  }, [isAuthenticated, countRefresh, role, dispatch]);
};
