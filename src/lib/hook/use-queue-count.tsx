import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hook";
import {
  getQueueRequest,
  setQueueCount,
  toggleCountRefresh,
} from "../store/reducer/session"; // <-- your count action
import { showToast } from "@/components/common/toast";

export const useQueueCountOnResume = (
  isAuthenticated: boolean,
  role: string
) => {
  if (role !== "ASTROLOGER") return;
  const dispatch = useAppDispatch();
  const { countRefresh } = useAppSelector((state) => state.session);

  const fetchQueueCount = async () => {
    try {
      const payload = await dispatch(getQueueRequest()).unwrap();
      if (payload.success) {
        dispatch(setQueueCount(payload?.users.length));
      } else {
        showToast.error("Something went wrong! try again");
      }
    } catch (err) {
    } finally {
      dispatch(toggleCountRefresh());
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (countRefresh) {
      fetchQueueCount();
    }
  }, [isAuthenticated, countRefresh]);
};
