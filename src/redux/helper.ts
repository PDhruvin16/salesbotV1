import { useSelector } from "react-redux";
import { persistor, store, type RootState } from "./store";
import moment from "moment";
import { clearAuthData, setAuthData } from "./slices/authSlice";
import { setViewMode } from "./slices/viewModeSlice";
import { setPermissions } from "./slices/permissionSlice";
import { PermissionState as PermissionType } from "../types/permission";
import { GridViewMode } from "./slices/viewModeSlice";
 
export const useUserDetails = () => {
  return useSelector((state: RootState) => state.auth);
};
 
export const updateAuthData = (data: Partial<RootState["auth"]>) => {
  const currentUser = store.getState().auth;
  store.dispatch(
    setAuthData({
      ...currentUser,
      ...data,
    })
  );
};
 
export const updatePermissionData = (
  data: RootState["permission"]["permissions"]
) => {
  store.dispatch(setPermissions(data));
};
 
export const removeAuthData = (): void => {
  store.dispatch(clearAuthData());
  persistor.purge();
};
 
export const useIsPlanExpired = (): boolean => {
  return useSelector((state: RootState) => {
    const { subscription } = state.auth;
    if (!subscription || !subscription.end_date) return true;
 
    const endDateUTC = moment.utc(subscription.end_date);
    const nowUTC = moment.utc();
    return endDateUTC.isBefore(nowUTC);
  });
};
 
export const useDaysRemaining = (): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  return useSelector((state: RootState) => {
    const { subscription } = state.auth;
    if (!subscription || !subscription.end_date)
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
 
    const endDateUTC = moment.utc(subscription.end_date);
    const nowUTC = moment.utc();
    const duration = moment.duration(endDateUTC.diff(nowUTC));
 
    if (duration.asMilliseconds() <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
 
    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  });
};
